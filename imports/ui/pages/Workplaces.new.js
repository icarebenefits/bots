import React, {Component, PropTypes} from 'react';
import {createContainer} from 'meteor/react-meteor-data';

/* components */
import {PageSideBar} from '../components';

import {
  Label,
  FormInput,
  FormActions,
} from '../components/elements';


class Workplaces extends Component {

  renderAddWP() {
    return (
      <div className="col-md-12">
        {/* Add workplace */}
        <div className="portlet light bordered">
          <div className="portlet-body">
            <div className="row">
              <div className="col-md-12">
                <Label
                  className="col-md-4 bold uppercase pull-left"
                  value="Search by groupId/groupName: "
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <form className="form-horizontal" role="form">
                  <div className="form-body">
                    <div className="form-group">
                      <Label
                        className="col-md-2 control-label pull-left"
                        value="Search by groupId/groupName: "
                      />
                      <div className="col-md-9">
                        <FormInput
                          ref="search"
                          type="suggest"
                          options={[]}
                          value={''}
                          className="form-control input-medium"
                          placeholder="group Id or name..."
                          handleOnChange={() => {}}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <Label
                        className="col-md-2 control-label pull-left"
                        value="Description: "
                      />
                      <div className="col-md-9">
                        <FormInput
                          ref="desc"
                          value={''}
                          type="text" multiline={true}
                          className="form-control input-inline input-medium"
                          placeholder="SLA description"
                          handleOnChange={() => {}}
                        />
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderWP() {

  }

  render() {

    return (
      <div className="page-content-row">
        <PageSideBar
          options={[]}
          active="work"
        />
        <div className="page-content-col">
          <div className="row">
            {this.renderAddWP()}
          </div>
          <div className="row">
            {this.renderWP()}
          </div>
        </div>
      </div>
    );
  }
}

Workplaces.propTypes = {};

export default Workplaces