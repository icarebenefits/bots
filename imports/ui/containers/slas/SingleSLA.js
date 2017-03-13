import React, {Component, PropTypes} from 'react';

import {
  Label,
  FormInput,
  FormActions,
} from '../../components/elements';

import {ConditionsBuilder} from '../../components/conditions-builder';
import ScheduleBuilder from '../../components/schedule-builder/ScheduleBuilder';

class SingleSLA extends Component {

  getData() {
    return {
      name: this.refs.name.getValue(),
      description: this.refs.desc.getValue(),
      workplace: this.refs.workplace.getValue(),
      frequency: this.refs.frequency.getData(),
      conditions: this.refs.conditions.getConditions(),
    };
  }

  render() {
    const
      {mode, actions, Workplaces, SLA} = this.props;

    const wpOptions = Workplaces.map(w => ({
      name: w.id,
      label: w.name,
    }));


    if (mode === 'view') {
      const {name = '', description = '', workplace = '', frequency = {}, status, conditions} = SLA;
      return (
        <div>
          <form className="form-horizontal" role="form" style={{width: 900}}>
            <div className="form-body">
              <div className="form-group">
                <Label
                  className="col-md-2 control-label pull-left"
                  value="Name: "
                />
                <Label
                  className="col-md-2 control-label text-align-left"
                  value={name}
                />
              </div>
              <div className="form-group">
                <Label
                  className="col-md-2 control-label pull-left"
                  value="Description: "
                />
                <Label
                  className="col-md-2 control-label pull-left"
                  value={description}
                />
              </div>
              <div className="form-group">
                <Label
                  className="col-md-2 control-label pull-left"
                  value="Workplace: "
                />
                <Label
                  className="col-md-2 control-label pull-left"
                  value={workplace}
                />
              </div>
              <div className="form-group">
                <Label
                  className="col-md-2 control-label pull-left"
                  value="Frequency: "
                />
                <Label
                  className="col-md-2 control-label pull-left"
                  value={this.props.getScheduleText(frequency)}
                />
              </div>
            </div>
          </form>

          <div className="row">
            <div className="col-md-12">
              <ConditionsBuilder
                readonly={true}
                ref="conditions"
                conditions={conditions}
              />
            </div>
          </div>

          <FormActions
            {...actions}
          />
        </div>
      );
    }
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
                  type="text"
                  value={mode === 'edit' ? SLA.name : ''}
                  className="form-control input-medium"
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
                  value={mode === 'edit' ? SLA.description : ''}
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
                  defaultValue={mode === 'edit' ? SLA.workplace : ''}
                  className="form-control input-medium"
                  options={wpOptions}
                  handleOnChange={() => {}}
                />
              </div>
            </div>
          </div>
        </form>

        <div className="row" style={{marginBottom: 20}}>
          <div className="col-md-12">
            <ScheduleBuilder
              ref="frequency"
              label="Frequency"
              frequency={mode === 'edit' ? SLA.frequency : {
                preps: 'on the',
                range: 'first',
                unit: 'day of the week',
                preps2: '',
                range2: '',
              }}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
            <ConditionsBuilder
              ref="conditions"
              conditions={mode === 'edit' ? SLA.conditions : []}
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