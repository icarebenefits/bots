import {Meteor} from 'meteor/meteor';
import React, {Component, PropTypes} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {connect} from 'react-redux';
import {FlowRouter} from 'meteor/kadira:flow-router';
import _ from 'lodash';

/* Components */
import {
  Label,
  FormInput,
  FormActions,
} from '../components/elements';

import {NoContent} from '../components/common';

import {ConditionsBuilder} from '../components/conditions-builder';
import ScheduleBuilder from '../components/schedule-builder/ScheduleBuilder';
import MessageBuilder from '../components/message-builder/MessageBuilder';

/* Collections */
import {SLAs} from '/imports/api/collections/slas';
import {WorkplaceGroups as WPCollection} from '/imports/api/collections/workplaces';

/* Actions */
import {
  initSLA, resetSLA
} from '/imports/ui/store/actions';

class SingleSLA extends Component {
  constructor(props) {
    super(props);

    // console.log('props', props);
    // if(!_.isEmpty(props.SLA)) {
    //   props.onInitSLA(props.SLA);
    // }
  }

  componentWillMount() {
    // console.log('props', this.props);
    // console.log('next props', nextProps);
    const {SLA, onInitSLA} = this.props;
    if(!_.isEmpty(SLA)) {
      onInitSLA(SLA);
    }
  }

  render() {
    console.log('props', this.props);
    const
      {
        ready, mode,
        WPs,
        onValidateAndPreview, onSaveAsDraft, onSave,
        onSaveAndExecute, onCancel
      } = this.props;
    const
      isEditMode = mode === 'edit',
      buttons = [
        {
          id: 'validate_preview', label: 'Validate & Preview',
          className: 'btn-info', type: 'button', onClick: onValidateAndPreview
        },
        {
          id: 'draft', label: 'Save as Draft',
          className: 'green', type: 'button', onClick: onSaveAsDraft
        },
        {
          id: 'save', label: 'Save',
          className: 'green', type: 'button', onClick: onSave
        },
        {
          id: 'save_execute', label: 'Save & Execute',
          className: 'green', type: 'button', onClick: onSaveAndExecute
        },
        {
          id: 'cancel', label: 'Cancel',
          className: 'btn-default', type: 'button', onClick: onCancel
        }
      ],
      defaultFrequency = {
        preps: 'on the',
        range: 'first',
        unit: 'day of the week',
        preps2: '',
        range2: '',
      };
    const wpOptions = WPs.map(w => ({
      name: w.id,
      label: w.name,
    }));
    wpOptions.splice(0, 0, {name: '', label: ''});

    if (ready) {
      if (isEditMode && _.isEmpty(SLA)) {
        return (
          <NoContent
            message={`SLA not found.`}
          />
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
                            value={isEditMode ? SLA.name : ''}
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
                            value={isEditMode ? SLA.description : ''}
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
                            defaultValue={isEditMode ? SLA.workplace : ''}
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
                  frequency={isEditMode ? SLA.frequency : defaultFrequency}
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
                  conditions={isEditMode ? SLA.conditions : []}
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
                  message={isEditMode ? SLA.message : {}}
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="portlet light bordered">
            <div className="portlet-body">
              <div className="row">
                <FormActions
                  buttons={buttons}
                />
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div>Loading...</div>
      );
    }
  }
}

SingleSLA.propTypes = {};

const SingleSLAContainer = createContainer(props => {
  const
    {
      params: {country},
      queryParams: {mode, id}
    } = FlowRouter.current(),
    subSLAs = Meteor.subscribe('slasList'),
    subWPs = Meteor.subscribe('groups'),
    ready = subSLAs.ready() && subWPs.ready(),
    SLA = SLAs.findOne({_id: id}),
    WPs = WPCollection.find({country}).fetch();

  return {
    ready,
    country,
    mode,
    SLA,
    WPs
  };
}, SingleSLA);

const mapStateToProps = (state, ownProps) => {
  if(ownProps.mode === 'edit') {
    return {workingSLA: state.sla.SLA};
  }
  return {};
};

const mapDispatchToProps = dispatch => ({
  onInitSLA: SLA => dispatch(initSLA({SLA})),
  onResetSLA: () => dispatch(resetSLA()),
  onValidateAndPreview: () => dispatch(),
  onSaveAsDraft: () => dispatch,
  onSave: () => dispatch,
  onSaveAndExecute: () => dispatch,
  onCancel: () => FlowRouter.setQueryParams({mode: 'list', id: null})
});

export default connect(mapStateToProps, mapDispatchToProps)(SingleSLAContainer);