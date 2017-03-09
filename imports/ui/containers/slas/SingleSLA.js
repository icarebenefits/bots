import React, {Component, PropTypes} from 'react';

import {
  Label,
  FormInput,
  FormActions,
} from '../../components/elements';

import {ConditionGroup} from '../../components/conditions-builder/netsuite-style/ConditionGroup';

class SingleSLAs extends Component {

  handleActionSLA(action) {

  }

  render() {
    const
      {mode, actions} = this.props;

    console.log('SingleSLA', {mode, actions});
    return (
      <div>
        <form className="form-horizontal" role="form" style={{width: 900}}>
          <div className="form-body">
            <div className="form-group">
              <Label
                className="col-md-2 control-label pull-left"
                value="Name: "
              />
              <div className="col-md-9">
                <FormInput
                  type="text" className="form-control input-medium"
                  placeholder="SLA name"
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
                  type="text" multiline={true}
                  className="form-control input-inline input-medium"
                  placeholder="SLA description"
                />
              </div>
            </div>
            <div className="form-group">
              <Label
                className="col-md-2 control-label pull-left"
                value="Workplace: "
              />
              <div className="col-md-9">
                <FormInput
                  type="select"
                  className="form-control input-medium"
                  options={[]}
                />
              </div>
            </div>
          </div>
        </form>

        <div className="row">
          <div className="col-md-12">
            <ConditionGroup />
          </div>
        </div>

        <FormActions
          {...actions}
        />
      </div>
    );
  }
}

SingleSLAs.propTypes = {
  mode: PropTypes.oneOf(['view', 'add', 'edit']),
  actions: PropTypes.shape({
    buttons: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        type: PropTypes.type,
        className: PropTypes.string,
        label: PropTypes.string,
        handleOnClick: PropTypes.func,
      }),
    ),
    position: PropTypes.string,
  })
};

export default SingleSLAs