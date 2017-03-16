import {Meteor} from 'meteor/meteor';
import React, {Component, PropTypes} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import classNames from 'classnames';
import {FlowRouter} from 'meteor/kadira:flow-router';
import _ from 'lodash';

// collections
import {WorkplaceGroups} from '/imports/api/collections/workplaces';
import SLAsCollection from '/imports/api/collections/slas/slas';

import * as Notify from '/imports/api/notifications';

// Job Server
import JobServer from '/imports/api/jobs/index';

// methods
import Methods from '/imports/api/collections/slas/methods';

// components
import {
  ListSLAs,
  SingleSLA,
} from '../containers';
import {
  PageSideBar
} from '../components';

class SLAs extends Component {
  constructor() {
    super();

    this.state = {
      mode: 'list',
      row: null,
      action: '',
      dialog: null,
      error: null,
      info: null,
      warning: null,
    };

    // handlers
    this.handleChangeMode = this.handleChangeMode.bind(this);
    this.handleActionSLA = this.handleActionSLA.bind(this);

    // helpers
    this._addSLA = this._addSLA.bind(this);
    this._editSLA = this._editSLA.bind(this);
    this._pauseSLA = this._pauseSLA.bind(this);
    this._resumeSLA = this._resumeSLA.bind(this);
    this._removeSLA = this._removeSLA.bind(this);

    // render
    this._renderListSLAs = this._renderListSLAs.bind(this);
    this._renderSingleSLA = this._renderSingleSLA.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const {ready, Workplaces} = nextProps;
    if (ready && _.isEmpty(Workplaces)) {
      Notify.warning({title: 'Workplaces', message: 'Please add at least 1 workplace.'});
    }
  }

  shouldComponentUpdate(nextProps) {
    const {ready, Workplaces} = nextProps;
    return ready && !_.isEmpty(Workplaces);
  }

  _validateData({SLA, mode}, callback) {
    const
      {name, workplace, frequency, conditions, country} = SLA
      ;

    if (_.isEmpty(name)) {
      callback({error: `Name of SLA is required.`});
    } else {
      if (_.isEmpty(workplace)) {
        callback({error: `Workplace of SLA is required.`});
      } else {
        if (this._validateSchedule(frequency) !== -1) {
          callback({error: `Schedule is invalid.`});
        } else {
          if (_.isEmpty(conditions)) {
            callback({error: `Conditions of SLA is required.`});
          } else {
            const {filter, operator, values} = conditions[0];
            if (_.isEmpty(filter) || _.isEmpty(operator) || _.isEmpty(values)) {
              callback({error: `Conditions of SLA is required.`});
            } else {
              if(mode === 'add') {
                Methods.validateName.call({name, country}, (error, result) => {
                  if(error) {
                    callback({error: error.reason});
                  } else {
                    const {error} = result;
                    if(error) {
                      callback({error});
                    } else {
                      callback({});
                    }
                  }
                });
              } else {
                callback({});
              }
            }
          }
        }
      }

    }

    return {};
  }

  // function check the frequency is the same
  _isSameFreq(freq, nextFreq) {
    const keys = Object.keys(freq);
    let isSame = true;
    keys.map(key => isSame = isSame && (freq[key] === nextFreq[key]));
    return isSame;
  }

  _addSLA(action) {
    const
      {Workplaces} = this.props,
      {name, description, workplace, frequency, conditions, message} = this.refs.SLA.getData(),
      country = FlowRouter.getParam('country')
      ;

    const
      wpName = Workplaces.filter(wp => wp.id === workplace)[0].name,
      status = (action === 'draft') ? action : 'active'
      ;
    const SLA = {name, description, workplace: wpName, frequency, conditions, message, country, status};

    // validate SLA data
    this._validateData({SLA, mode: 'add'}, ({error}) => {
      if (error) {
        Notify.error({title: 'Add SLA', message: error});
        return this.setState({action: null});
      } else {
        Methods.create.call(SLA, (error, slaId) => {
          if (error) {
            Notify.error({title: 'Add SLA', message: 'Name of SLA had been exists'});
            return this.setState({action: null});
          }
          else {
            console.log('add sla')
            if (action !== 'draft') {
              try {
                JobServer(country).createJob({
                  name,
                  freqText: this.getScheduleText(frequency),
                  info: {slaId}
                }, (err, res) => {
                  if (err) {
                    Notify.error({title: 'Add SLA', message: 'Setup frequency failed.'});
                    Methods.setStatus.call({_id: slaId, status: 'draft'});
                  }

                  if (action === 'execute') {
                    // execute the SLA immediately
                    Notify.warning({title: 'Add SLA', message: `executing SLA: ${slaId}`});
                  }
                  Notify.info({title: 'Add SLA', message: 'success'});
                  return this.setState({mode: 'list', action: null});
                });
              } catch (e) {
                Notify.error({title: 'Add SLA', message: 'Setup frequency failed.'});
                Methods.setStatus.call({_id: slaId, status: 'draft'});
                return this.setState({mode: 'list', action: null});
              }
            } else {
              Notify.info({title: 'Add SLA', message: 'success'});
              return this.setState({mode: 'list', action: null});
            }
          }
        });
      }
    });
  }

  _editSLA(SLA, action) {
    const
      {Workplaces} = this.props,
      {_id, frequency: oldFreq} = SLA,
      {name, description, workplace, frequency, conditions, message} = this.refs.SLA.getData(),
      country = FlowRouter.getParam('country')
      ;

    const wpName = Workplaces.filter(wp => wp.id === workplace)[0].name,
      status = (action === 'draft') ? action : null;
    const
      newSLA = {_id, name, description, frequency, conditions, message, workplace: wpName, status, country}
      ;


    // validate SLA data
    this._validateData({SLA: newSLA, mode: 'edit'}, ({error}) => {

      if (error) {
        Notify.error({title: 'Edit SLA', message: error});
        return this.setState({action: null});
      } else {
        Methods.edit.call(newSLA, (error, result) => {
          if (error) {
            Notify.error({title: 'Edit SLA', message: error.reason});
            return this.setState({action: null});
          }
          else {
            if (!this._isSameFreq(oldFreq, frequency)) {
              JobServer(country).editJob({name, freqText: this.getScheduleText(frequency), info: {slaId: _id}},
                (err, res) => {
                  if (err) {
                    Notify.error({title: 'Edit SLA', message: err.reason});
                    return this.setState({action: null});
                  } else {
                    if(action === 'draft') {
                      // cancel all Jobs
                      JobServer(country).cancelJob({name},
                        (err, res) => {
                          if (err) {
                            Notify.error({title: 'Edit SLA', message: err.reason});
                            return this.setState({action: null});
                          }
                        });
                    }
                  }
                });
            }
            Notify.info({title: 'Edit SLA', message: 'saved'});
            return this.setState({mode: 'list', action: null});
          }
        });
      }
    });
  }

  _pauseSLA(id) {
    const {_id, name, status} = this.props.SLAsList[id],
      country = FlowRouter.getParam('country');
    let message = '';
    console.log('pause', _id)
    JobServer(country).pauseJob({name}, (err, res) => {
      if (err) Notify.error({title: 'Pause SLA', message: err.reason});
      else {
        Methods.setStatus.call({_id, status: 'paused'}, (error, result) => {
          if (error) {
            Notify.error({title: 'Pause SLA', message: error.reason});
          }
          else {
            Notify.info({title: 'Pause SLA', message: 'success'});
          }
        });
      }
    });
    return this.setState({mode: 'list', action: null});

  }

  _restartSLA(id) {
    const {_id, name, status} = this.props.SLAsList[id],
      country = FlowRouter.getParam('country');
    let message = '';
    console.log('restart', _id)
    JobServer(country).restartJob({name}, (err, res) => {
      if (err) Notify.error({title: 'Restart SLA', message: err.reason});
      else {
        Methods.setStatus.call({_id, status: 'restarted'}, (error, result) => {
          if (error) {
            Notify.error({title: 'Restart SLA', message: error.reason});
          }
          else {
            Notify.info({title: 'Restart SLA', message: 'success'});
          }
        });
      }
    });
    return this.setState({mode: 'list', action: null});
  }

  _resumeSLA(id) {
    const {_id, name, status} = this.props.SLAsList[id],
      country = FlowRouter.getParam('country');
    let message = '';
    console.log('resume', _id)
    JobServer(country).resumeJob({name}, (err, res) => {
      if (err) Notify.error({title: 'Resume SLA', message: err.reason});
      else {
        Methods.setStatus.call({_id, status: 'resumed'}, (error, result) => {
          if (error) {
            Notify.error({title: 'Resume SLA', message: error.reason});
          }
          else {
            Notify.info({title: 'Resume SLA', message: 'success'});
          }
        });
      }
    });
    return this.setState({mode: 'list', action: null});
  }

  _removeSLA(id) {
    const {_id, name} = this.props.SLAsList[id],
      country = FlowRouter.getParam('country');
    Methods.remove.call({_id}, (error, result) => {
      if (error) {
        Notify.error({title: 'Remove SLA', message: error.reason});
      }
      else {
        JobServer(country).removeJob({name}, (err, res) => {
          if (err) {
            Notify.error({title: 'Remove SLA', message: err.reason});
          }
        });
        Notify.info({title: 'Remove SLA', message: 'success'});
      }
      return this.setState({mode: 'list', action: null});
    });
  }


  getScheduleText(freq) {
    const
      {
        first: {preps, range, unit},
        second: {preps: preps2, range: range2},
      } = freq
      ;
    let text = '';

    !_.isEmpty(preps) && (text = `${preps}`);
    !_.isEmpty(range) && (text = `${text} ${range}`);
    !_.isEmpty(unit) && (preps === 'at') ? (text = `${text}:${unit}`) : (text = `${text} ${unit}`);
    !_.isEmpty(preps2) && (text = `${text} ${preps2}`);
    !_.isEmpty(range2) && (text = `${text} ${range2}`);

    return text;
  }

  _validateSchedule(freq) {
    const text = this.getScheduleText(freq);
    const {error} = later.parse.text(text);
    return error; // -1: success; >0 failed
  }

  handleChangeMode(event, action, row) {
    event.preventDefault();
    this.setState({mode: action, row});
  }

  handleActionSLA(event, action, row) {
    event.preventDefault();

    switch (action) {
      case 'back':
      {
      }
      case 'cancel':
      {
        return this.setState({mode: 'list', action: null});
      }
      case 'remove':
      {
        return this._removeSLA(row);
      }
      case 'pause':
      {
        return this._pauseSLA(row);
      }
      case 'resume':
      {
        return this._resumeSLA(row);
      }
      case 'restart':
      {
        return this._restartSLA(row);
      }
      case 'validate':
      {
        Notify.info({title: 'Validate conditions', message: 'looks great.'});
        return this.setState({action});
      }
      case 'draft':
      {
        if (this.state.mode === 'edit') {
          this._editSLA(this.props.SLAsList[this.state.row], action);
        } else {
          this._addSLA(action);
        }
        return this.setState({action});
      }
      case 'save':
      {
        if (this.state.mode === 'edit') {
          this._editSLA(this.props.SLAsList[this.state.row], action);
        } else {
          this._addSLA(action);
        }
        return this.setState({action});
      }
      case 'execute':
      {
        if (this.state.mode === 'edit') {
          this._editSLA(this.props.SLAsList[this.state.row], action);
        } else {
          this._addSLA(action);
        }
        return this.setState({action});
      }
      case 'edit':
      {
        return this.setState({mode: action, action});
      }
      default:
      {
        Notify.error({title: '', message: `Unknown action: ${action}`});
      }
    }
  }

  getScheduleText(freq) {
    const
      {preps, range, unit, preps2, range2} = freq;
    let text = '';

    !_.isEmpty(preps) && (text = `${preps}`);
    !_.isEmpty(range) && (text = `${text} ${range}`);
    !_.isEmpty(unit) && (preps === 'at') ? (text = `${text}:${unit}`) : (text = `${text} ${unit}`);
    !_.isEmpty(preps2) && (text = `${text} ${preps2}`);
    !_.isEmpty(range2) && (text = `${text} ${range2}`);

    return text;
  }

  _renderListSLAs() {
    const
      {SLAsList} = this.props,
      listSLAsProps = {
        toolbar: {
          buttons: [
            {
              id: 'add',
              className: 'sbold green',
              icon: 'fa fa-plus',
              label: 'Add',
              handleOnClick: this.handleChangeMode
            }
          ],
          tools: []
        },
        list: {
          headers: ['Name', 'Workplace', 'Frequency', 'Status'],
          data: [[]],
          readonly: true,
          actions: [
            {id: 'view', label: 'View details', handleAction: this.handleChangeMode},
            {id: 'restart', label: 'Restart', handleAction: this.handleActionSLA},
            {id: 'pause', label: 'Pause', className: 'yellow', handleAction: this.handleActionSLA},
            {id: 'resume', label: 'Resume', className: 'green', handleAction: this.handleActionSLA},
            {
              id: 'remove', label: '', icon: 'fa fa-times',
              className: 'btn-danger', handleAction: this.handleActionSLA
            },
          ],
          handleDoubleClick: (dataset) => {
            const {row, cell} = dataset;
            // console.log('click on field', {row, cell});
          },
        },
      }
      ;

    const dataList = SLAsList.map(s => ([
      {id: 'name', type: 'input', value: s.name},
      {id: 'workplace', type: 'input', value: s.workplace},
      {id: 'frequency', type: 'input', value: this.getScheduleText(s.frequency)},
      {id: 'status', type: 'input', value: s.status},
    ]));

    listSLAsProps.list.data = dataList;

    return (
      <ListSLAs
        {...listSLAsProps}
      />
    );
  }

  _renderSingleSLA(mode) {
    const
      {Workplaces, SLAsList} = this.props,
      {row} = this.state,
      actions = {
        buttons: [],
        position: 'col-md-offset-1 col-md-9'
      }
      ;

    switch (mode) {
      case 'add':
      {
      }
      case 'edit':
      {
        actions.buttons = [
          {
            id: 'validate', label: 'Validate & Preview',
            className: 'btn-info', type: 'button', handleOnClick: this.handleActionSLA
          },
          {
            id: 'draft', label: 'Save as Draft',
            className: 'green', type: 'button', handleOnClick: this.handleActionSLA
          },
          {
            id: 'save', label: 'Save',
            className: 'green', type: 'button', handleOnClick: this.handleActionSLA
          },
          {
            id: 'execute', label: 'Save and Execute',
            className: 'green', type: 'button', handleOnClick: this.handleActionSLA
          },
          {
            id: 'cancel', label: 'Cancel',
            className: 'btn-default', type: 'button', handleOnClick: this.handleActionSLA
          },
        ];
        break;
      }
      case 'view':
      {
        actions.buttons = [
          {
            id: 'edit', label: 'Edit',
            className: 'btn-info', type: 'button', handleOnClick: this.handleActionSLA
          },
          {
            id: 'back', label: 'Back',
            className: 'btn-default', type: 'button', handleOnClick: this.handleActionSLA
          },
        ]
        break;
      }
      default:
      {
        alert(`Unknown action: ${mode}`);
      }
    }

    return (
      <div className="row">
        <SingleSLA
          ref="SLA"
          mode={mode}
          Workplaces={Workplaces}
          SLA={SLAsList[row]}
          actions={actions}
          getScheduleText={this.getScheduleText}
        />
      </div>
    );
  }

  render() {
    const
      {ready, Workplaces} = this.props,
      country = FlowRouter.getParam('country'),
      {mode} = this.state,
      sideBarProps = {
        options: [
          {id: 'list', icon: 'fa fa-star', label: 'List SLA', handleOnClick: this.handleChangeMode},
          {id: 'add', icon: 'fa fa-plus', label: 'Add SLA', handleOnClick: this.handleChangeMode},
        ],
        active: mode
      }
      ;
    let renderSLA = () => {
    };

    if (mode === 'list') {
      renderSLA = this._renderListSLAs;
    } else {
      renderSLA = this._renderSingleSLA;
    }

    if (ready) {
      return (
        <div className="page-content-row">
          <PageSideBar
            {...sideBarProps}
          />
          <div className="page-content-col">
            <div className="portlet light bordered">
              <div className="portlet-title">
                <div className="caption font-dark">
                  <i className="icon-settings font-dark"></i>
                  <span className="caption-subject bold uppercase">{`${mode} SLA`}</span>
                </div>
              </div>
              <div className={classNames({"portlet-body": true, 'form': !(mode === 'list')})}>
                {renderSLA(mode)}
              </div>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div>Loading...</div>
    );
  }
}

SLAs.propTypes = {};

const SLAsContainer = createContainer(() => {
  const
    country = FlowRouter.getParam('country'),
    subWorkplaces = Meteor.subscribe('groups'),
    subSLAs = Meteor.subscribe('slasList'),
    ready = subWorkplaces.ready() && subSLAs.ready(),
    Workplaces = WorkplaceGroups.find({country}).fetch(),
    SLAsList = SLAsCollection.find({country}).fetch()
    ;

  return {
    ready,
    Workplaces,
    SLAsList,
  };
}, SLAs);

export default SLAsContainer