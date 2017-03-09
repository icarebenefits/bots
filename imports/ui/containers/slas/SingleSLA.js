import React, {Component, PropTypes} from 'react';

import {
  Label,
  FormInput,
  FormActions,
} from '../../components/elements';

import {ConditionGroup} from '../../components/conditions-builder/netsuite-style/ConditionGroup';

class SingleSLA extends Component {

  getData() {
    return {
      name: this.refs.name.getValue(),
      description: this.refs.desc.getValue(),
      workplace: this.refs.workplace.getValue(),
      frequency: this.refs.frequency.getValue(),
      conditions: this.refs.conditions.getConditions(),
    };
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
                  ref="name"
                  type="text" className="form-control input-medium"
                  placeholder="SLA name"
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
                  type="text" multiline={true}
                  className="form-control input-inline input-medium"
                  placeholder="SLA description"
                  handleOnChange={() => {}}
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
                  ref="workplace"
                  className="form-control input-medium"
                  options={[
                    {name: '244483225939000', label: 'iCare Reloaded'}
                  ]}
                  handleOnChange={() => {}}
                />
              </div>
            </div>
            <div className="form-group">
              <Label
                className="col-md-2 control-label pull-left"
                value="Frequency: "
              />
              <div className="col-md-9">
                <FormInput
                  type="select"
                  ref="frequency"
                  className="form-control input-medium"
                  options={[
                    {name: '0', label: 'before 12th hour'},
                    {name: '1', label: 'on the first day of the week'},
                    {name: '2', label: 'on the last day of the month'},
                    {name: '3', label: 'on the 15th through 20th day of the month'},
                    {name: '4', label: 'every 5 mins every weekend'},
                    {name: '5', label: 'every 20 mins starting on the 7th min'},
                    {name: '6', label: 'after 12th hour'},
                    {name: '7', label: 'before 12th hour'},
                    {name: '8', label: 'at 5:00 pm'},
                    {name: '9', label: 'at 5:00 pm on Weds,Thurs and Fri'},
                    {name: '10', label: 'at 5:00 pm'},
                  ]}
                  handleOnChange={() => {}}
                />
              </div>
            </div>
          </div>
        </form>

        <div className="row">
          <div className="col-md-12">
            <ConditionGroup
              ref="conditions"
            />
          </div>
        </div>

        <FormActions
          {...actions}
        />
      </div>
    );
  }
}

SingleSLA.propTypes = {
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

export default SingleSLA