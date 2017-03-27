import React, {Component, PropTypes} from 'react';

import {
  Label,
  FormInput,
  FormActions,
} from '../../components/elements';

import {ConditionsBuilder} from '../../components/conditions-builder';
import ScheduleBuilder from '../../components/schedule-builder/ScheduleBuilder';
import MessageBuilder from '../../components/message-builder/MessageBuilder';

class SingleSLA extends Component {

  getData() {
    return {
      name: this.refs.name.getValue(),
      description: this.refs.desc.getValue(),
      workplace: this.refs.workplace.getValue(),
      frequency: this.refs.frequency.getData(),
      conditions: this.refs.conditions.getConditions(),
      message: this.refs.message.getData(),
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
      const {name = '', description = '', workplace = '', frequency = {}, status, conditions, message} = SLA;
      return (
        <div className="col-md-12">
          {/* Information */}
          <div className="portlet light bordered">
            <div className="portlet-body">
              <div className="row">
                <div className="col-md-12">
                  <Label
                    className="col-md-4 bold uppercase pull-left"
                    value="Informations: "
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <form className="form-horizontal" role="form" style={{width: 900}}>
                    <div className="form-body">
                      <table className="table table-striped table-no-border">
                        <tbody>
                        <tr>
                          <td><strong>Name:</strong></td>
                          <td>{name}</td>
                        </tr>
                        <tr>
                          <td><strong>Description:</strong></td>
                          <td>{description}</td>
                        </tr>
                        <tr>
                          <td><strong>Workplace:</strong></td>
                          <td>{Workplaces.filter(w => w.id === workplace)[0].name }</td>
                        </tr>
                        <tr>
                          <td><strong>Frequency:</strong></td>
                          <td>{this.props.getScheduleText(frequency)}</td>
                        </tr>
                        </tbody>
                      </table>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>

          {/* Conditions */}
          <div className="portlet light bordered">
            <div className="portlet-body">
              <div className="row">
                <ConditionsBuilder
                  readonly={true}
                  ref="conditions"
                  conditions={conditions}
                />
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="portlet light bordered">
            <div className="portlet-body">
              <div className="row">
                <MessageBuilder
                  ref="message"
                  readonly={true}
                  message={message}
                />
              </div>
            </div>
          </div>

          <FormActions
            {...actions}
          />
        </div>
      );
    }
    return (
      <div className="col-md-12">
        {/* information */}
        <div className="portlet light bordered">
          <div className="portlet-body">
            <div className="row" style={{marginBottom: 20}}>
              <div className="col-md-12">
                <Label
                  className="col-md-4 bold uppercase pull-left"
                  value="Informations: "
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
              </div>
            </div>
          </div>
        </div>

        {/* Frequency */}
        <div className="portlet light bordered">
          <div className="portlet-body">
            <div className="row" style={{marginBottom: 20}}>
              <ScheduleBuilder
                ref="frequency"
                label="Frequency"
                hasValidate={false}
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
        </div>

        {/* Conditions */}
        <div className="portlet light bordered">
          <div className="portlet-body">
            <div className="row">
              <ConditionsBuilder
                ref="conditions"
                conditions={mode === 'edit' ? SLA.conditions : []}
              />
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="portlet light bordered">
          <div className="portlet-body">
            <div className="row">
              <MessageBuilder
                ref="message"
                message={mode === 'edit' ? SLA.message : {}}
              />
            </div>
          </div>
        </div>

        {/* Actions */}
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