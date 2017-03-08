import React, {Component, PropTypes} from 'react';

import {ConditionGroup} from '../../ui/components/conditions-builder/netsuite-style/ConditionGroup';

class EditSLAs extends Component {
  render() {
    return (
      <form className="form-horizontal" role="form" style={{width: 900}}>
        <div className="form-body">
          <div className="form-group">
            <label className="col-md-1 col-md-offset-1 control-label pull-left">Name</label>
            <div className="col-md-9">
              <input type="text" className="form-control" placeholder="Enter text"/>
              <span className="help-block"> A block of help text. </span>
            </div>
          </div>
          <div className="form-group">
            <label className="col-md-1 col-md-offset-1 control-label pull-left">Description</label>
            <div className="col-md-9">
              <input type="text" className="form-control input-inline input-medium" placeholder="Enter text"/>
              <span className="help-inline"> Inline help. </span>
            </div>
          </div>
          <div className="form-group">
            <label className="col-md-1 col-md-offset-1 control-label pull-left">Workplace</label>
            <div className="col-md-9">
              <div className="input-inline input-medium">
                <div className="input-group">
                  <span className="input-group-addon">
                    <i className="fa fa-user"></i>
                  </span>
                  <input type="email" className="form-control" placeholder="Email Address"/></div>
              </div>
              <span className="help-inline"> Inline help. </span>
            </div>
          </div>
          <div className="form-group">
            <div className="col-md-11 col-md-offset-1">
              <ConditionGroup />
            </div>
          </div>
        </div>
        <div className="form-actions">
          <div className="row">
            <div className="col-md-offset-1 col-md-9">
              <button type="submit" className="btn btn-info">Validate & Preview</button>
              {' '}
              <button type="button" className="btn default">Save as Draft</button>
              {' '}
              <button type="button" className="btn green">Save</button>
              {' '}
              <button type="button" className="btn yellow">Save and Execute</button>
            </div>
          </div>
        </div>
      </form>
    );
  }
}

EditSLAs.propTypes = {};

export default EditSLAs