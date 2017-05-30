import {Meteor} from 'meteor/meteor';
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
import SLACollection from '/imports/api/collections/slas/slas';

/* Components */
import {List, Toolbar} from '/imports/ui/components';
import {FormInput, Dialog} from '/imports/ui/components/elements';

/* Functions */
import {searchSLAList, getScheduleText} from '/imports/utils';

class ListSLA extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dialog: false,
      slaId: '',
      action: '',
      country: ''
    };

    this._getListData = this._getListData.bind(this);
    // handlers
    this.onClickEdit = this.onClickEdit.bind(this);
    this.onClickCopy = this.onClickCopy.bind(this);
    this.onClickPublish = this.onClickPublish.bind(this);
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

  onClickCopy(action, slaId) {
    this.setState({dialog: {action}, slaId, country: ''});
  }

  onClickPublish(action, slaId) {
    this.setState({dialog: {action}, slaId, country: ''});
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
    const {dialog} = this.state;

    if (!dialog) {
      return null;
    }

    const {action} = dialog, {country} = this.state;

    return (
      <Dialog
        modal={true}
        bodyClass="text-left"
        header={`${S(action).capitalize().s} SLA`}
        confirmLabel="Ok"
        hasCancel={true}
        onAction={this._closeDialog}
      >
        <div className="form-body">
          <div className="form-group">
            <div className="caption">
              <i className="icon-edit font-dark"/>
              <span className="caption-subject font-dark bold uppercase">
                {`Choose country to ${action}`}
              </span>
            </div>
          </div>
          <div className="form-group form-inline">
            <FormInput
              type="select"
              value={country}
              options={[
              {name: '', label: ''},
              {name: 'vn', label: 'Vietnam'},
              {name: 'kh', label: 'Cambodia'},
              {name: 'la', label: 'Laos'}
              ]}
              handleOnChange={this._onChooseCountry}
            />
          </div>
        </div>
      </Dialog>
    );
  }

  _closeDialog(action) {
    if(action === 'confirm') {
      const {slaId: copied, country} = this.state;
      FlowRouter.go('setup', {page: 'setup', country}, {tab: 'sla', mode: 'edit', copied});
    } else {
      this.setState({dialog: null});
    }
  }

  render() {
    const {
      ready, filter,
      onFilter, onSearch,
      onClickAdd, onClickRemove,
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
          icon: '', onClick: this.onClickCopy
        },
        {
          id: 'publish', label: 'Publish',
          icon: '', onClick: this.onClickPublish
        },
        {
          id: 'remove', label: 'Remove',
          icon: '', onClick: onClickRemove
        }
      ]
    };

    console.log('dialog', this.state.dialog);

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
  onCopySLA: PropTypes.func,
  onPublishSLA: PropTypes.func,
  onClickRemove: PropTypes.func
};

const ListSLAContainer = createContainer((props) => {
  const
    country = FlowRouter.getParam('country'),
    {filter, search} = props,
    slaStatus = filter === 'all' ? undefined : filter,
    subWp = Meteor.subscribe('groups'),
    subSLAs = Meteor.subscribe('slasList'),
    ready = subWp.ready() && subSLAs.ready(),
    WPs = WPCollection.find({country}).fetch();

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
  onCopySLA: (action, _id, country) => dispatch(actionOnSLA(SLA_COPY, action, _id, country)),
  onPublishSLA: (action, _id, country) => dispatch(actionOnSLA(SLA_PUBLISH, action, _id, country)),
  onClickRemove: (action, _id) => dispatch(actionOnSLA(SLA_REMOVE, action, _id))
});

export default connect(mapStateToProps, mapDispatchToProps)(ListSLAContainer)
