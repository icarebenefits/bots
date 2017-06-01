import {Meteor} from 'meteor/meteor';
import React, {Component, PropTypes} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import _ from 'lodash';
import moment from 'moment';
import S from 'string';

/* Methods */
import ESMethods from '/imports/api/elastic/methods';

/* Notify */
import * as Notify from '/imports/api/notifications';

/* Collections */
import {WorkplaceGroups} from '/imports/api/collections/workplaces';

/* Components */
import {ListPlace} from '/imports/ui/containers';
import {PageSideBar} from '/imports/ui/components';
import {Button, Suggest} from '/imports/ui/components/elements';

import {
  Label,
  FormInput,
  FormActions,
} from '/imports/ui/components/elements';


class Workplaces extends Component {

  constructor(props) {
    super(props);

    this.state = {
      search: '',
      currentSuggest: '',
      suggests: [],
      workplace: null,
    };

    // render handlers
    this._renderWorkplaces = this._renderWorkplaces.bind(this);
    this._renderAddWP = this._renderAddWP.bind(this);

    // functions
    this._getWPList = this._getWPList.bind(this);

    // handlers
    this._handleSuggestWP = this._handleSuggestWP.bind(this);
    this.handleActionWP = this.handleActionWP.bind(this);
    this.handleAddWP = this.handleAddWP.bind(this);
  }

  handleActionWP(action, _id) {
    switch (action) {
      case 'remove':
      {
        return this._removeWP(_id);
      }
      default:
      {
        return Notify.error({title: `Access list action ${action}`, message: 'Unsupported.'})
      }
    }
  }

  _handleSuggestWP(text) {
    const suggestText = text.toString().toLowerCase();
    ESMethods.suggest.call({
      index: 'suggester',
      type: 'wp_group',
      body: {
        suggest: {
          wp_group: {
            prefix: suggestText,
            completion: {
              field: "suggest"
            }
          }
        }
      },
      size: 1,
    }, (err, res) => {
      if (err) {
        return Notify.warning({title: 'Search workplace', message: `Failed: ${JSON.stringify(err)}`});
      }
      else {
        let suggests = [];
        if (_.isEmpty(res) && !_.isEmpty(suggestText)) {
          if (!isNaN(Number(suggestText))) {
            Meteor.call('groups.getName', Number(suggestText), (err, res) => {
              if (err || res.err) {
                suggests = [{name: suggestText, label: 'No workplace found.'}];
                this.setState({workplace: null});
              }
              const {id, privacy, name} = res;
              this.setState({workplace: {id, name, privacy}});

            });
          } else {
            // no result for groupId
            suggests = [{name: suggestText, label: 'No workplace found.'}];
            this.setState({workplace: null});
          }
        } else {
          suggests = res
            .map(s => ({
              name: s.id,
              label: s.name,
            }));
        }
        return this.setState({suggests});
      }
    });
  }

  handleAddWP(event) {
    event.preventDefault();
    const
      {country} = this.props,
      groupId = Number(this.refs.suggest.getValue());
    Meteor.call('groups.getName', groupId, (err, res) => {
      if (err) {
        return Notify.error({title: `Add workplace`, message: `Failed: ${JSON.stringify(err)}`});
      } else {
        const {name: groupName, id: groupId} = res;
        Meteor.call('groups.insert', {groupId, groupName, country}, (err) => {
          if (err) {
            return Notify.error({title: `Add workplace`, message: `Failed: ${JSON.stringify(err)}`});
          } else {
            Notify.info({title: `Add workplace`, message: `Success.`});
            return this.setState({search: ''});
          }
        });
      }
    });
  }

  _removeWP(_id) {
    Meteor.call('groups.remove', {_id}, (err) => {
      if (err) {
        return Notify.error({title: `Remove workplace`, message: `Failed: ${JSON.stringify(err)}`});
      } else {
        Notify.info({title: `Remove workplace`, message: 'Success.'});
        return this.setState({currentSuggest: ''});
      }
    });
  }

  _getWPList(search) {
    const {WPList} = this.props;
    let list = WPList;

    // fields search: id, name
    if (!_.isEmpty(search)) {
      list = list
        .filter(item => {
          return (
            S(item.name.toLowerCase()).contains(search)
            || S(item.id.toString().toLowerCase()).contains(search)
          );
        });
    }

    return list;
  }

  _renderAddWP() {
    const {suggests, currentSuggest, workplace} = this.state;
    let hasWP = false;
    if(!_.isEmpty(workplace)) {
      if(!_.isEmpty(workplace.id)) {
        hasWP = true;
      } else {
        hasWP = false;
      }
    }

    return (
      <div className="col-md-12">
        <div className="portlet light bordered">
          <div className="portlet-body">
            <div className="row" style={{marginBottom: 20}}>
              <div className="col-md-12">
                <Label
                  className="col-md-4 bold uppercase pull-left"
                  value="Add workplace: "
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <div className="table-toolbar">
                  <div className="col-md-6 pull-left" style={{marginTop: 2, paddingRight: 0}}>
                    <Suggest
                      ref="suggest"
                      className="form-control"
                      options={suggests}
                      defaultValue={currentSuggest}
                      placeHolder="Enter Id or search by name..."
                      handleOnChange={value => this._handleSuggestWP(value)}
                    />
                  </div>
                  <div className="col-md-3 pull-left">
                    <div className="btn-group">
                      <Button
                        id="add"
                        className="bold green"
                        disabled={!hasWP}
                        onClick={this.handleAddWP}
                      >Add{' '}<i className="fa fa-plus"/></Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {hasWP && (
              <div className="row">
                <div className="alert alert-info">
                  <strong className="uppercase">Details</strong><br/>
                  <strong>{'ID: '}</strong>{workplace.id}<br/>
                  <strong>{'Name: '}</strong>{workplace.name}<br/>
                  <strong>{'Privacy: '}</strong>{workplace.privacy}<br/>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  _renderWorkplaces() {
    const
      {search} = this.state,
      listWPProps = {
        toolbar: {
          buttons: [
            // {
            //   id: 'add',
            //   className: 'bold green',
            //   icon: 'fa fa-plus',
            //   label: 'Add',
            //   handleOnClick: this.handleAddWP
            // }
          ],
          toolLabel: `tool Label`,
          tools: [],
          hasSearch: true,
          searchPlaceHolder: 'Search by id/name...',
          handleOnChange: this.handleToolbarChange,
        },
        list: {
          headers: ['ID', 'Name', 'Created at'],
          data: [[]],
          readonly: true,
          actions: [
            {
              id: 'remove', label: '',
              icon: 'fa fa-times', className: 'btn-danger',
              onClick: this.handleActionWP
            },
          ],
          handleDoubleClick: () => {
          },
        },
      };

    const list = this._getWPList(search);
    listWPProps.list.data = list.map(item => ({
      _id: item._id,
      row: [
        {id: 'id', type: 'input', value: item.id},
        {
          id: 'name',
          type: 'input',
          value: item.name
        },
        {
          id: 'createdAt',
          type: 'input',
          value: moment(item.createdAt).format('LLL')
        },
        {}
      ]
    }));

    return (
      <div className="col-md-12">
        <div className="portlet light bordered">
          <div className="portlet-body">
            <div className="row" style={{marginBottom: 20}}>
              <div className="col-md-12">
                <Label
                  className="col-md-4 bold uppercase pull-left"
                  value="List workplaces: "
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <ListPlace
                  {...listWPProps}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const {ready} = this.props;
    if (ready) {
      return (
        <div className="page-content-row">
          <PageSideBar
            options={[]}
            active="work"
          />
          <div className="page-content-col">
            <div className="note note-info">
              <h2>
                <span className="label label-primary uppercase"> {`Workplaces`} </span>
              </h2>
            </div>
            <div className="row">
              {this._renderAddWP()}
            </div>
            <div className="row">
              {this._renderWorkplaces()}
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          Loading...
        </div>
      );
    }
  }
}

Workplaces.propTypes = {};

const WorkplacesContainer = createContainer(() => {
  const
    sub = Meteor.subscribe('groups'),
    ready = sub.ready(),
    country = FlowRouter.getParam('country'),
    WPList = WorkplaceGroups.find({country}).fetch();

  return {
    ready,
    country,
    WPList,
  };
}, Workplaces);

export default WorkplacesContainer