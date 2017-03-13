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
    this._enableSLA = this._enableSLA.bind(this);

    // render
    this._renderListSLAs = this._renderListSLAs.bind(this);
    this._renderSingleSLA = this._renderSingleSLA.bind(this);
  }

  _validateData(name, wpName, frequency, filter, operator, values) {
    if (_.isEmpty(name)) {
      Notify.error({title: 'Add SLA', message: `Name of SLA is required.`});
      return false;
    }
    if (_.isEmpty(wpName)) {
      Notify.error({title: 'Add SLA', message: `Workplace of SLA is required.`});
      return false;
    }
    if (this._validateSchedule(frequency) !== -1) {
      Notify.error({title: 'Add SLA', message: `Schedule is invalid`});
      return false;
    }
    if (_.isEmpty(filter) || _.isEmpty(operator) || _.isEmpty(values)) {
      Notify.error({title: 'Add SLA', message: `Conditions of SLA is required.`});
      return false;
    }

    return true;
  }

  _addSLA(status, message) {
    const
      {Workplaces} = this.props,
      {name, description, workplace, frequency, conditions} = this.refs.SLA.getData(),
      country = FlowRouter.getParam('country'),
      {filter, operator, values} = conditions[0]
      ;

    const wpName = Workplaces.filter(wp => wp.id === workplace)[0].name;

    console.log('addSLA', {name, wpName, frequency, filter, operator, values});
    if (!this._validateData(name, wpName, frequency, filter, operator, values)) {
      return;
    }

    Methods.create.call({name, description, workplace: wpName, frequency, status: status, conditions, country},
      (error, result) => {
        if (error) {
          return Notify.error({title: 'Add SLA', message: 'Name of SLA had been exists'});
        }
        else {
          return Notify.info({title: 'Add SLA', message: message});
        }
      });
  }

  _editSLA(SLA, status) {
    const
      {Workplaces} = this.props,
      {_id} = SLA,
      {name, description, workplace, frequency, conditions} = this.refs.SLA.getData(),
      country = FlowRouter.getParam('country')
      ;
    const wpName = Workplaces.filter(wp => wp.id === workplace)[0].name;
    const
      newSLA = {_id, name, description, frequency, conditions, workplace: wpName, status: status, country}
      ;

    Methods.edit.call(newSLA, (error, result) => {
      if (error) {
        return Notify.error({title: 'Edit SLA', message: error.reason});
      }
      else {
        return Notify.info({title: 'Edit SLA', message: 'saved'});
      }
    });
  }

  _enableSLA(id) {
    const {_id, status} = this.props.SLAsList[id];
    let message = '';
    Methods.setStatus.call({_id, status: Number(!Boolean(status))}, (error, result) => {
      if (error) {
        return Notify.error({title: 'Enable SLA', message: error.reason});
      }
      else {
        return Notify.info({title: 'Enable SLA', message: 'success'});
      }
    });
  }

  _removeSLA(id) {
    const {_id} = this.props.SLAsList[id];
    Methods.remove.call({_id}, (error, result) => {
      if (error) {
        return Notify.error({title: 'Remove SLA', message: error.reason});
      }
      else {
        return Notify.info({title: 'Remove SLA', message: 'success'});
      }
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
      case 'enable':
      {
        return this._enableSLA(row);
      }
      case 'validate':
      {
        Notify.info({title: 'Validate conditions', message: 'success'});
        return this.setState({action});
      }
      case 'saveDraft':
      {
        if (this.state.mode === 'edit') {
          this._editSLA(this.props.SLAsList[this.state.row], 0, 'saved as draft');
        } else {
          this._addSLA(0, 'saved as draft');
        }
        return this.setState({action});
      }
      case 'save':
      {
        if (this.state.mode === 'edit') {
          this._editSLA(this.props.SLAsList[this.state.row], 1, 'saved');
        } else {
          this._addSLA(1, 'saved');
        }
        return this.setState({action});
      }
      case 'saveRun':
      {
        if (this.state.mode === 'edit') {
          this._editSLA(this.props.SLAsList[this.state.row], 1, 'saved and running');
        } else {
          this._addSLA(1, 'saved and running');
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
            {id: 'enable', label: 'Enable', handleAction: this.handleActionSLA},
            {id: 'view', label: 'View details', handleAction: this.handleChangeMode},
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
      {id: 'status', type: 'input', value: s.status ? 'active' : 'inactive'},
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
            id: 'saveDraft', label: 'Save as Draft',
            className: 'green', type: 'button', handleOnClick: this.handleActionSLA
          },
          {
            id: 'save', label: 'Save',
            className: 'green', type: 'button', handleOnClick: this.handleActionSLA
          },
          {
            id: 'saveRun', label: 'Save and Execute',
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
      {ready} = this.props,
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