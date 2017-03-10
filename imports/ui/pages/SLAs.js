import {Meteor} from 'meteor/meteor';
import React, {Component, PropTypes} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import classNames from 'classnames';
import {FlowRouter} from 'meteor/kadira:flow-router';
import _ from 'lodash';

// collections
import {WorkplaceGroups} from '/imports/api/collections/workplaces';
import SLAsCollection from '/imports/api/collections/slas/slas';

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

  _addSLA({status}) {
    const
      {Workplaces} = this.props,
      {name, description, workplace, frequency, conditions} = this.refs.SLA.getData(),
      country = FlowRouter.getParam('country')
      ;

    console.log(frequency);
    // const wpName = Workplaces.filter(wp => wp.id === workplace)[0].name;
    //
    // _.isEmpty(name) && alert(`Name of SLA is required.`);
    // _.isEmpty(wpName) && alert(`Workplace of SLA is required.`);
    // (_.isEmpty(conditions[0].filter) ||
    // _.isEmpty(conditions[0].operator) ||
    // _.isEmpty(conditions[0].values)) && alert(`Condition of SLA is required.`);
    //
    // Methods.create.call({name, description, workplace: wpName, frequency, status, conditions, country},
    //   (error, result) => {
    //     if (error) alert(error.reason);
    //     else return this.setState({mode: 'list', action: null});
    //   });
  }

  _editSLA(SLA, status) {
    const
      {Workplaces} = this.props,
      {name, description, workplace, frequency, conditions} = this.refs.SLA.getData(),
      country = FlowRouter.getParam('country')
      ;
    const wpName = Workplaces.filter(wp => wp.id === workplace)[0].name;
    const
      newSLA = {...SLA, ...this.refs.SLA.getData(), workplace: wpName, status, country}
      ;

    delete newSLA.createdAt;
    delete newSLA.updatedAt;

    Methods.edit.call(newSLA, (error, result) => {
      if (error) alert(error.reason);
      else alert(`SLA saved`);
    });
  }

  _enableSLA(id) {
    const {_id, status} = this.props.SLAsList[id];
    Methods.setStatus.call({_id, status: Number(!Boolean(status))}, (error, result) => {
      if (error) alert(error.reason);
      else return this.setState({mode: 'list', action: null});
    });
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
      case 'enable':
      {
        this._enableSLA(row);
        return this.setState({action});
      }
      case 'validate':
      {
        alert(`good to go`);
        return this.setState({action});
      }
      case 'saveDraft':
      {
        if (this.state.mode === 'edit') {
          this._editSLA(this.props.SLAsList[this.state.row], 0);
        } else {
          this._addSLA({status: 0});
        }
        return this.setState({action});
      }
      case 'save':
      {
        if (this.state.mode === 'edit') {
          this._editSLA(this.props.SLAsList[this.state.row], 1);
        } else {
          this._addSLA({status: 1});
        }
        return this.setState({action});
      }
      case 'saveRun':
      {
        if (this.state.mode === 'edit') {
          this._editSLA(this.props.SLAsList[this.state.row], 1);
        } else {
          this._addSLA({status: 1});
        }
        console.log('run job immediately');
        return this.setState({action});
      }
      case 'edit':
      {
        return this.setState({mode: action, action});
      }
      default:
      {
        alert(`Unknown action: ${action}`);
      }
    }
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
      {id: 'frequency', type: 'input', value: s.frequency},
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
            className: 'btn-default', type: 'button', handleOnClick: this.handleActionSLA
          },
          {
            id: 'save', label: 'Save',
            className: 'green', type: 'button', handleOnClick: this.handleActionSLA
          },
          {
            id: 'saveRun', label: 'Save and Execute',
            className: 'yellow', type: 'button', handleOnClick: this.handleActionSLA
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

    console.log('state', this.state);

    return (
      <div className="row">
        <SingleSLA
          ref="SLA"
          mode={mode}
          Workplaces={Workplaces}
          SLA={SLAsList[row]}
          actions={actions}
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
          {id: 'list', icon: 'fa fa-star', label: 'List SLAs', handleOnClick: this.handleChangeMode},
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
                  <span className="caption-subject bold uppercase">{`${mode} SLA${mode === 'list' ? 's' : ''}`}</span>
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