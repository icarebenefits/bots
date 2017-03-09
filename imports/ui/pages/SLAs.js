import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';

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
      action: '',
      dialog: null,
      error: null,
    };

    // handlers
    this.handleChangeMode = this.handleChangeMode.bind(this);
    this.handleActionSLA = this.handleActionSLA.bind(this);

    // helpers

    // render
    this._renderListSLAs = this._renderListSLAs.bind(this);
    this._renderSingleSLA = this._renderSingleSLA.bind(this);
  }

  handleChangeMode(event, action, row) {
    event.preventDefault();
    // console.log('handleChangeMode', {row, action});
    this.setState({mode: action});
  }

  handleActionSLA(event, action, row) {
    event.preventDefault();
    console.log('handleActionSLA', {row, action});
    console.log('handleActionSLA data', this.refs.SLA.getData());
    this.setState({action});
  }

  _renderListSLAs() {
    const listSLAsProps = {
        toolbar: {
          buttons: [
            {id: 'add', className: 'sbold green', icon: 'fa fa-plus', label: 'Add', handleOnClick: this.handleChangeMode}
          ],
          tools: []
        },
        list: {
          headers: ['Name', 'Workplace', 'Frequency', 'Status'],
          data: [
            [
              {id: 'name', type: 'input', value: 'iCare member'},
              {id: 'workplace', type: 'input', value: 'iCare reloaded'},
              {id: 'frequency', type: 'input', value: 'every week at 10:00 AM'},
              {id: 'status', type: 'input', value: 'running'},
            ],
            [
              {id: 'name', type: 'input', value: 'Hire date'},
              {id: 'workplace', type: 'input', value: 'Engineering'},
              {id: 'frequency', type: 'input', value: 'at 10:00 AM'},
              {id: 'status', type: 'input', value: 'inactive'},
            ]
          ],
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

    return (
      <ListSLAs
        {...listSLAsProps}
      />
    );
  }

  _renderSingleSLA(mode) {
    const actions = {
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

    // console.log('_renderSingleSLA', {mode, actions});

    return (
      <div className="row">
        <SingleSLA
          ref="SLA"
          mode={mode}
          actions={actions}
        />
      </div>
    );
  }

  render() {
    const
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
}

SLAs.propTypes = {};

export default SLAs