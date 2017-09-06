import React, {Component} from 'react';

/* Components */
import {Label} from '/imports/ui/components/elements';
import {AddApiProfile, ListApiProfile} from '/imports/ui/containers';

class ApiProfileComponent extends Component {

  _renderAddApiProfile() {
    return (
      <div className="col-md-12">
        <div className="portlet light bordered">
          <div className="portlet-body">
            <div className="row" style={{marginBottom: 20}}>
              <div className="col-md-12">
                <div className="note note-info">
                  <h4 className="block uppercase">Add API Profile</h4>
                </div>
              </div>
            </div>
            <div className="row">
                <AddApiProfile />
            </div>
          </div>
        </div>
      </div>
    );
  }

  _renderApiProfileList() {

    return (
      <div className="col-md-12">
        <div className="portlet light bordered">
          <div className="portlet-body">
            <div className="row" style={{marginBottom: 20}}>
              <div className="col-md-12">
                <div className="note note-info">
                  <h4 className="block uppercase">List API Profiles</h4>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <ListApiProfile />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="page-content-row">
        <div className="page-content-col">
          <div className="note note-info">
            <h2>
              <span className="label label-primary uppercase"> {`API Profile`} </span>
            </h2>
          </div>
          <div className="row">
            {this._renderAddApiProfile()}
          </div>
          <div className="row">
            {this._renderApiProfileList()}
          </div>
        </div>
      </div>
    );
  }
}

export default ApiProfileComponent