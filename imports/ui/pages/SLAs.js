import React, {Component, PropTypes} from 'react';

class SLAs extends Component {
  constructor() {
    super();

    this.state = {
      view: true,
      edit: null,
    };
  }

  _renderToolsBar() {
    return (
      <div className="row">
        Tools bar
      </div>
    );
  }

  _renderViewSLAs() {
    return (
      <div className="row">
        View SLAs
      </div>
    );
  }

  _renderEditSLAs() {
    return (
      <div className="row">
        Edit/Create SLA
      </div>
    );
  }

  render() {
    return (
      <div className="page-content-col">
        {this._renderToolsBar()}
        {this._renderViewSLAs()}
        {this._renderEditSLAs()}
      </div>
    );
  }
}

SLAs.propTypes = {};

export default SLAs