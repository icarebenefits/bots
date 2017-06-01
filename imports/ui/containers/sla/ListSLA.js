import {Meteor} from 'meteor/meteor';
import {Session} from 'meteor/session';
import React, {Component, PropTypes} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {connect} from 'react-redux';
import S from 'string';
import moment from 'moment';
import {FlowRouter} from 'meteor/kadira:flow-router';

/* CONSTANTS */
import {
  TOOLBARS, LISTS, MORE_BUTTON,
  SLA_SET_FILTER, SLA_SET_SEARCH,
  SLA_ADD, SLA_EDIT,
  SLA_REMOVE, SLA_ACTIVATE, SLA_INACTIVATE,
  SLA_COPY, SLA_PUBLISH
} from '/imports/ui/store/constants';
/* Actions */
import {
  setFilter, setSearch, closeDialog,
  actionOnSLA, onChangeModeEdit
} from '/imports/ui/store/actions';

/* Collections */
import {WorkplaceGroups as WPCollection} from '/imports/api/collections/workplaces';
import {SLAs as SLACollection, Methods} from '/imports/api/collections/slas';
import {Countries as CountriesCollection} from '/imports/api/collections/countries';

/* Components */
import {List, Toolbar} from '/imports/ui/components';
import {FormInput, Dialog} from '/imports/ui/components/elements';

/* Functions */
import {searchSLAList, getScheduleText} from '/imports/utils';
/* Notify */
import * as Notify from '/imports/api/notifications';

class ListSLA extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dialog: false,
      slaId: '',
      action: '',
      country: '',
      publishedUrl: ''
    };

    this._getListData = this._getListData.bind(this);
    // handlers
    this.onClickEdit = this.onClickEdit.bind(this);
    this.onClickMoreAction = this.onClickMoreAction.bind(this);
    this._onChooseCountry = this._onChooseCountry.bind(this);

    this._renderDialog = this._renderDialog.bind(this);
    this._closeDialog = this._closeDialog.bind(this);
  }

  onClickEdit(mode, id) {
    const {SLAs, onChangeModeEdit} = this.props;
    const SLA = SLAs.filter(s => s._id === id)[0] || {};
    onChangeModeEdit(SLA);
    FlowRouter.setQueryParams({mode, id});
  }

  onClickMoreAction(action, slaId) {
    this.setState({dialog: true, action, slaId, country: ''});
  }

  _onChooseCountry(country) {
    this.setState({country});
  }

  _getListData() {
    const {SLAs, WPs, search} = this.props;
    let list = SLAs;
    if (!_.isEmpty(search)) {
      list = searchSLAList(list, WPs, search);
    }

    return list.map(s => {
      let wpName = '';
      if (s.workplace) {
        const wp = WPs.filter(w => w.id === Number(s.workplace));
        if (!_.isEmpty(wp)) {
          wpName = wp[0].name;
        } else {
          wpName = '';
        }
      }
      return {
        _id: s._id, row: [
          {id: 'name', type: 'input', value: s.name},
          {
            id: 'workplace',
            type: 'input',
            value: wpName
          },
          {
            id: 'frequency',
            type: 'input',
            value: (s.frequency.preps === 'at' && _.isEmpty(s.frequency.preps2))
              ? `${getScheduleText(s.frequency)} daily`
              : getScheduleText(s.frequency)
          },
          {
            id: 'lastExecution',
            type: 'input',
            value: s.lastExecutedAt
              ? moment(new Date(s.lastExecutedAt)).format('LLL')
              : (s.status === 'draft' ? 'pending' : 'waiting')
          },
          {id: 'status', type: 'input', value: s.status},
        ]
      }
    });
  }

  _renderDialog() {
    const {dialog} = this.state,
      {Countries} = this.props;

    if (!dialog) {
      return null;
    }

    const {action, publishedUrl, country} = this.state;
    const countryOptions = Countries.map(c => ({name: c.code, label: c.name}));
    countryOptions.splice(0, 0, {name: '', label: ''});
    if(action === 'publish') {
      countryOptions.splice(1, 0, {name: 'all', label: 'All'});
    }
    const
      showPublishedUrl = (action === 'publish' && !_.isEmpty(publishedUrl)),
      showSelectCountry = (action === 'copy' || (action === 'publish' && _.isEmpty(publishedUrl)));
    let message = '', confirmLabel = '';
    if(action === 'remove')
      confirmLabel = 'Yes';
      message = 'This action can not be undo, are you sure about this?';
    if(action === 'publish') {
      if(!_.isEmpty(publishedUrl)) {
        confirmLabel = 'Visit';
        message = 'Published SLA to production, SLA URL is: ';
      } else {
        confirmLabel = 'Ok';
        message = `Choose country to ${action}`;
      }
    }
    if(action === 'copy') {
      confirmLabel = 'Ok';
      message = `Choose country to ${action}`;
    }

    return (
      <Dialog
        modal={true}
        bodyClass="text-left"
        className={showPublishedUrl && 'DialogMedium'}
        header={`${S(action).capitalize().s} SLA`}
        href={showPublishedUrl && publishedUrl}
        openTab={true}
        confirmLabel={confirmLabel}
        hasCancel={true}
        onAction={this._closeDialog}
      >
        <div className="form-body">
          <div className="form-group">
            <div className="caption">
              <i className="icon-edit font-dark"/>
              <span className="caption-subject font-dark bold uppercase">
                {message}
              </span>
            </div>
          </div>
          {showPublishedUrl && (
            <div className="alert alert-info">
              {publishedUrl}
            </div>
          )}
          {showSelectCountry && (
            <div className="form-group form-inline">
              <FormInput
                type="select"
                value={country}
                options={countryOptions}
                handleOnChange={this._onChooseCountry}
              />
            </div>
          )}
        </div>
      </Dialog>
    );
  }

  _closeDialog(dialogAction) {
    this.setState({dialog: null});
    if(dialogAction === 'confirm') {
      const {action, slaId, country, publishedUrl} = this.state;
      if(action === 'remove') {
        return this.props.onRemove(action, slaId);
      }
      if(action === 'copy') {
        Notify.info({
          title: 'Copy SLA',
          message: `Current country is ${this.props.Countries.filter(c => c.code === country)[0].name}`
        });
        return FlowRouter.go('setup', {page: 'setup', country}, {tab: 'sla', mode: 'edit', copied: slaId});
      }
      if(action === 'publish') {
        if(!_.isEmpty(publishedUrl)) {
          return this.setState({publishedUrl: ''});
        } else {
          this.setState({publishing: true});
          Meteor.call(`sla.${action}`, {_id: slaId, country}, (err, res) => {
            if (err) {
              Notify.error({
                title: 'Publish SLA',
                message: err.message
              });
              return this.setState({publishing: false, dialog: false});
            } else {
              // publish success, the publishUrl of SLA in production will be returned
              const {publishedUrl} = res;
              return this.setState({dialog: true, publishedUrl});
            }
          });
        }
      }
    } else {
      return this.setState({action: '', publishedUrl: ''});
    }
  }

  render() {
    const {
      ready, filter,
      onFilter, onSearch,
      onClickAdd,
      onClickActivate, onClickInactivate
    } = this.props;

    const listProps = {
      headers: ['Name', 'Workplace', 'Frequency', 'Last Execution'],
      actions: [
        {
          id: 'edit', label: 'Edit',
          icon: 'fa fa-pencil', className: 'btn-primary',
          onClick: this.onClickEdit
        },
        {
          id: 'activate', label: 'Activate',
          icon: 'fa fa-play', className: 'green',
          onClick: onClickActivate
        },
        {
          id: 'inactivate', label: 'Inactivate',
          icon: 'fa fa-stop', className: 'yellow',
          onClick: onClickInactivate
        }
      ],
      moreActions: [
        {
          id: 'copy', label: 'Copy',
          icon: '', onClick: this.onClickMoreAction
        },
        {
          id: 'remove', label: 'Remove',
          icon: '', onClick: this.onClickMoreAction
        }
      ]
    };
    // only show publish action in stage environment
    if(Meteor.settings.public.env === 'stage' && Session.get('isSuperAdmin')) {
      listProps.moreActions.splice(1, 0, {
        id: 'publish', label: 'Publish',
        icon: '', onClick: this.onClickMoreAction
      });
    }

    if (ready) {
      return (
        <div className="col-md-12">
          <Toolbar
            {...TOOLBARS['listSLA']}
            toolLabel={`${S(filter).capitalize().s} SLA`}
            onFilter={onFilter}
            onSearch={onSearch}
            onClick={onClickAdd}
          />

          {/*<ListHeader />*/}
          <List
            {...listProps}
            data={this._getListData()}
          />

          {/*<ListFooter />*/}

          {/* Dialog */}
          {this._renderDialog()}
        </div>
      );
    } else {
      return (
        <div>Loading...</div>
      );
    }
  }
}

ListSLA.propTypes = {
  ready: PropTypes.bool,
  country: PropTypes.string,
  filter: PropTypes.string,
  search: PropTypes.string,
  WPs: PropTypes.arrayOf(PropTypes.object),
  SLAs: PropTypes.arrayOf(PropTypes.object),
  onFilter: PropTypes.func,
  onSearch: PropTypes.func,
  onClickAdd: PropTypes.func,
  onChangeModeEdit: PropTypes.func,
  onClickActivate: PropTypes.func,
  onClickInactivate: PropTypes.func,
  onRemove: PropTypes.func
};

const ListSLAContainer = createContainer((props) => {
  const
    country = FlowRouter.getParam('country'),
    {filter, search} = props,
    slaStatus = filter === 'all' ? undefined : filter,
    subWp = Meteor.subscribe('groups'),
    subSLAs = Meteor.subscribe('slasList'),
    subCountries = Meteor.subscribe('countries'),
    ready = subWp.ready() && subSLAs.ready() && subCountries.ready(),
    WPs = WPCollection.find({country}).fetch(),
    Countries = CountriesCollection.find().fetch();

  const selector = {country};
  // filter by status
  if (slaStatus) {
    selector.status = slaStatus;
  }
  const SLAs = SLACollection.find(selector).fetch();

  return {
    ready,
    country,
    filter,
    search,
    WPs,
    SLAs,
    Countries
  };
}, ListSLA);


const mapStateToProps = state => {
  const {
    pageControl: {country},
    sla: {
      filter,
      search
    }
  } = state;
  return {
    country,
    filter,
    search
  };
};

const mapDispatchToProps = dispatch => ({
  onFilter: f => dispatch(setFilter(SLA_SET_FILTER)(f)),
  onSearch: s => dispatch(setSearch(SLA_SET_SEARCH)(s)),
  onClickAdd: mode => FlowRouter.setQueryParams({mode}),
  onChangeModeEdit: SLA => dispatch(onChangeModeEdit(SLA)),
  onClickActivate: (action, _id) => dispatch(actionOnSLA(SLA_ACTIVATE, action, _id)),
  onClickInactivate: (action, _id) => dispatch(actionOnSLA(SLA_INACTIVATE, action, _id)),
  onRemove: (action, _id) => dispatch(actionOnSLA(SLA_REMOVE, action, _id))
});

export default connect(mapStateToProps, mapDispatchToProps)(ListSLAContainer)
