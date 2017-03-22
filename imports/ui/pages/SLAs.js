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
    this._validateAndPreview = this._validateAndPreview.bind(this);

    // render
    this._renderListSLAs = this._renderListSLAs.bind(this);
    this._renderSingleSLA = this._renderSingleSLA.bind(this);
  }

  /**
   * Verify workplace exists
   * @param nextProps
   */
  componentWillReceiveProps(nextProps) {
    const {ready, Workplaces} = nextProps;
    if (ready && _.isEmpty(Workplaces)) {
      Notify.warning({title: 'Workplaces', message: 'Please add at least 1 workplace.'});
    }
  }

  /**
   * Stop rendering when there is no workplace
   * @param nextProps
   * @return {*|boolean}
   */
  shouldComponentUpdate(nextProps) {
    const {ready, Workplaces} = nextProps;
    return ready && !_.isEmpty(Workplaces);
  }

  /**
   * Validate the SLA data before save
   * @param SLA
   * @param mode
   * @param callback
   * @return {{}}
   * @private
   */
  _validateData({SLA, mode}, callback) {
    const
      {name, workplace, frequency, conditions, message, country} = SLA
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
              if (_.isEmpty(message)) {
                callback({error: `Message of SLA is required.`});
              } else {
                const {messageTemplate, variables} = message;
                if (_.isEmpty(messageTemplate)) {
                  callback({error: `Message template is required.`});
                } else {
                  const countLeft = (messageTemplate.match(/{/g) || []).length;
                  const countRight = (messageTemplate.match(/}/g) || []).length;
                  if (countLeft !== countRight || countLeft === 0 || countRight === 0) {
                    callback({error: `Message template is INVALID.`});
                  }
                  else {
                    const values = {};
                    let numOfValues = 0;
                    let hasInvalidVariable = false;
                    variables.map((v) => {
                      const {summaryType, field, name} =v;
                      if (messageTemplate.indexOf('{' + name + '}') >= 0) {
                        values[name] = Math.floor(Math.random() * (1000 + 1) + 12);
                        numOfValues++;
                      }
                      if (_.isEmpty(summaryType) || _.isEmpty(field) || _.isEmpty(name))
                        hasInvalidVariable = true;
                    });
                    // console.log(values);
                    if (hasInvalidVariable) {
                      callback({error: `Message has INVALID variable`});
                    } else if (variables.length != numOfValues || numOfValues != countLeft) {
                      callback({error: `Message template DO NOT match with given variables`});
                    } else {
                      if (mode === 'add') {
                        Methods.validateName.call({name, country}, (error, result) => {
                          if (error) {
                            callback({error: error.reason});
                          } else {
                            const {error} = result;
                            if (error) {
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
          }
        }
      }
    }

    return {};
  }

  /**
   * Check the frequency is changed or not
   * @param freq
   * @param nextFreq
   * @return {boolean}
   * @private
   */
  _isSameFreq(freq, nextFreq) {
    const keys = Object.keys(freq);
    let isSame = true;
    keys.map(key => isSame = isSame && (freq[key] === nextFreq[key]));
    return isSame;
  }

  /**
   * Add SLA into Database
   * @param action
   * @private
   */
  _addSLA(action) {
    const
      {country, Workplaces} = this.props,
      {name, description, workplace, frequency, conditions, message} = this.refs.SLA.getData()
      ;

    const
      status = (action === 'draft') ? action : 'active'
      ;
    const SLA = {name, description, workplace, frequency, conditions, message, country, status};

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

  /**
   * Edit SLA on Database
   * @param SLA
   * @param action
   * @private
   */
  _editSLA(SLA, action) {
    const
      {country, Workplaces} = this.props,
      {_id, frequency: oldFreq} = SLA,
      {name, description, workplace, frequency, conditions, message} = this.refs.SLA.getData()
      ;

    const
      status = (action === 'draft') ? action : null;
    const
      newSLA = {_id, name, description, frequency, conditions, message, workplace, status, country}
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
                  }
                });
            }
            if (action === 'draft') {
              // cancel all Jobs
              // console.log('going to cancel job')
              JobServer(country).cancelJob({name},
                (err, res) => {
                  if (err) {
                    Notify.error({title: 'Edit SLA', message: err.reason});
                    return this.setState({action: null});
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

  _validateAndPreview() {
    const
      {name, description, workplace, frequency, conditions, message} = this.refs.SLA.getData(),
      {country, Workplaces} = this.props
      ;

    // validate SLA data
    this._validateData({SLA: {name, workplace, conditions, frequency, country, message}, mode: 'edit'}, ({error}) => {
      if (error) {
        Notify.error({title: 'Validate SLA', message: error});
        return this.setState({action: null});
      } else {
        Methods.validateConditions.call({conditions}, (err, res) => {
          if(err) {
            Notify.error({title: 'Validate conditions', message: 'Invalid.'});
          } else if(res) {
            Notify.info({title: 'Validate conditions', message: 'Good.'});
          } else {
            Notify.warning({title: 'Validate conditions', message: 'Invalid.'});
          }
          return this.setState({action: null});
        });
      }
    });
  }

  /**
   * Pause the SLA
   * * Update status of SLA
   * * Send pause signal to job server to pause the job
   * @param id
   * @private
   */
  _pauseSLA(id) {
    const
      {_id, name, status} = this.props.SLAsList[id],
      {country} = this.props;
    let message = '';
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

  /**
   * Restart SLA
   * * Used when an SLA had been save as draft (job in job server had been canceled)
   * * Send restart signal to job server to restart the job
   * @param id
   * @private
   */
  _restartSLA(id) {
    const
      {_id, name, status} = this.props.SLAsList[id],
      {country} = this.props;
    let message = '';
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

  /**
   * Resume SLA
   * * Edit status of SLA
   * * Send resume signal to job server to resume the paused job
   * @param id
   * @private
   */
  _resumeSLA(id) {
    const {_id, name, status} = this.props.SLAsList[id],
      {country} = this.props;
    let message = '';
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

  /**
   * Remove SLA
   * * Remove SLA from Database
   * * Remove jobs from job server
   * @param id
   * @private
   */
  _removeSLA(id) {
    const {_id, name} = this.props.SLAsList[id],
      {country} = this.props;
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

  /**
   * Combine the frequency elements to a schedule text for using with later.js
   * @param freq
   * @return {string}
   */
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

  /**
   * Use later.js to validate the schedule text
   * @param freq
   * @return {*}
   * @private
   */
  _validateSchedule(freq) {
    const text = this.getScheduleText(freq);
    const {error} = later.parse.text(text);
    return error; // -1: success; >0 failed
  }

  /**
   * Change state - mode for rendering the page
   * * Current modes are: list | edit | add | view
   * @param event
   * @param action
   * @param row
   */
  handleChangeMode(event, action, row) {
    event.preventDefault();
    this.setState({mode: action, row});
  }

  /**
   * Change state - mode & action when user click on Actions
   * * Current actions are: back | cancel | validate | draft | save | execute | edit
   * *    | remove | pause | resume | restart
   * @param event
   * @param action
   * @param row
   * @return {*}
   */
  handleActionSLA(event, action, row) {
    event.preventDefault();

    switch (action) {
      case 'back': {
      }
      case 'cancel': {
        return this.setState({mode: 'list', action: null});
      }
      case 'remove': {
        return this._removeSLA(row);
      }
      case 'pause': {
        return this._pauseSLA(row);
      }
      case 'resume': {
        return this._resumeSLA(row);
      }
      case 'restart': {
        return this._restartSLA(row);
      }
      case 'validate':
      {
        // Notify.info({title: 'Validate conditions', message: 'looks great.'});
        this._validateAndPreview();
        return this.setState({action});
      }
      case 'draft': {
        if (this.state.mode === 'edit') {
          this._editSLA(this.props.SLAsList[this.state.row], action);
        } else {
          this._addSLA(action);
        }
        return this.setState({action});
      }
      case 'save': {
        if (this.state.mode === 'edit') {
          this._editSLA(this.props.SLAsList[this.state.row], action);
        } else {
          this._addSLA(action);
        }
        return this.setState({action});
      }
      case 'execute': {
        if (this.state.mode === 'edit') {
          this._editSLA(this.props.SLAsList[this.state.row], action);
        } else {
          this._addSLA(action);
        }
        return this.setState({action});
      }
      case 'edit': {
        return this.setState({mode: action, action});
      }
      default: {
        Notify.error({title: '', message: `Unknown action: ${action}`});
      }
    }
  }

  /**
   * Render list of SLAs when mode is list
   * @return {XML}
   * @private
   */
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

  /**
   * Render single SLA in mode view | add | edit
   * @param mode
   * @return {XML}
   * @private
   */
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
      case 'add': {
      }
      case 'edit': {
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
      case 'view': {
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
      default: {
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

  /**
   * Render page
   * @return {XML}
   */
  render() {
    const
      {ready, country, Workplaces} = this.props,
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

SLAs.propTypes = {
  country: PropTypes.string,
  ready: PropTypes.bool,
  Workplaces: PropTypes.array,
  SLAsList: PropTypes.array,
};

/**
 * Prepare data for component
 */
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
    country,
    Workplaces,
    SLAsList,
  };
}, SLAs);

export default SLAsContainer