import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';

import {
  ViewSLAs,
  EditSLAs,
} from '../containers';
import {
  PageSideBar
} from '../components';

class SLAs extends Component {
  constructor() {
    super();

    this.state = {
      _render: 'view',
      dialog: null
    };

    // handlers
    this.handleActionSLA = this.handleActionSLA.bind(this);

    // helpers

    // render
    this._renderViewSLAs = this._renderViewSLAs.bind(this);
    this._renderAddSLA = this._renderAddSLA.bind(this);
    this._renderEditSLA = this._renderEditSLA.bind(this);
    this._renderDialog = this._renderDialog.bind(this);
  }

  handleActionSLA(event, action) {
    event.preventDefault();
    this.setState({
      _render: action
    })
  }

  _renderViewSLAs() {
    return (
      <ViewSLAs
        handleAddSLA={this.handleActionSLA}
      />
    );
  }

  _renderAddSLA() {
    return (
      <div className="row">
        <EditSLAs />
      </div>
    );
  }

  _renderEditSLA() {
    return (
      <div className="row">
        <EditSLAs />
      </div>
    );
  }

  _renderDialog() {
    if (this.state.dialog) {
      return (
        <div>
          Show Dialog
        </div>
      );
    }
    return null;
  }

  render() {
    const
      {_render} = this.state,
      sideBarProps = {
        options: [
          {id: 'view', icon: 'fa fa-star', label: 'View SLAs', handleOnClick: this.handleActionSLA},
          {id: 'add', icon: 'fa fa-plus', label: 'Add SLA', handleOnClick: this.handleActionSLA},
          {id: 'edit', icon: 'fa fa-edit', label: 'Edit SLA', handleOnClick: this.handleActionSLA},
        ],
        active: _render
      }
      ;
    let renderSLA = () => {
    };

    switch (_render) {
      case 'view':
      {
        renderSLA = this._renderViewSLAs;
        break;
      }
      case 'add':
      {
        renderSLA = this._renderAddSLA;
        break;
      }
      case 'edit':
      {
        renderSLA = this._renderEditSLA;
        break;
      }
      default:
      {
        renderSLA = this._renderViewSLAs;
      }
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
                <span className="caption-subject bold uppercase">{`${_render} SLA`}</span>
              </div>
            </div>
            <div className={classNames({"portlet-body": true, 'form': !(_render === 'view')})}>
              {renderSLA()}
            </div>
            {this._renderDialog()}
          </div>
        </div>
      </div>
    );
  }
}

SLAs.propTypes = {};

export default SLAs