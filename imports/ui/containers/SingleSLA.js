import {Meteor} from 'meteor/meteor';
import React, {Component, PropTypes} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {Promise} from 'meteor/promise';
import {FlowRouter} from 'meteor/kadira:flow-router';
import _ from 'lodash';
import validate from 'validate.js';

/* Components */
import ReactMarkdown from 'react-markdown';
import {
  Label,
  FormInput,
  FormActions,
  Dialog,
  Checkbox
} from '../components/elements';

import {NoContent} from '../components/common';
import {ConditionsBuilder, ScheduleBuilder, MessageBuilder} from '../components';

/* Collections */
import {SLAs, Methods} from '/imports/api/collections/slas';
import {WorkplaceGroups as WPCollection} from '/imports/api/collections/workplaces';

/* Notify */
import * as Notify from '/imports/api/notifications';

import {formatMessage} from '/imports/utils';

class SingleSLA extends Component {
  constructor() {
    super();

    this.state = {
      validating: false,
      saving: false,
      executing: false,
      previewing: false,
      showPreviewQuery: false,
      previewMessage: '',
      previewQueries: []
    };

    this._getSLA = this._getSLA.bind(this);
    this._closeDialog = this._closeDialog.bind(this);
    this._renderDialog = this._renderDialog.bind(this);
    this._onShowPreviewQuery = this._onShowPreviewQuery.bind(this);

    this._onPreview = this._onPreview.bind(this);
    this._onDraft = this._onDraft.bind(this);
    this._onSave = this._onSave.bind(this);
    this._onExecute = this._onExecute.bind(this);
    this._onEditSLA = this._onEditSLA.bind(this);
    this._onCreateSLA = this._onCreateSLA.bind(this);

    this.onClickValidateAndPreview = this.onClickValidateAndPreview.bind(this);
    this.onClickSaveAsDraft = this.onClickSaveAsDraft.bind(this);
    this.onClickSave = this.onClickSave.bind(this);
    this.onClickSaveAndExecute = this.onClickSaveAndExecute.bind(this);
  }

  _getSLA() {
    const {name, desc, workplace, frequency, conditions, message} = this.refs;
    const {country} = this.props;
    const SLA = {
      name: name.getValue(),
      description: desc.getValue(),
      workplace: workplace.getValue(),
      frequency: frequency.getData(),
      conditions: conditions.getConditions(),
      message: message.getData(),
      country
    };
    return SLA;
  }

  _onShowPreviewQuery(value) {
    this.setState({showPreviewQuery: value});
  }

  _onValidateName(country, name, _id) {
    // verify name is duplicated or not
    // async call
    return new Promise((resolve, reject) => {
      Methods.validateName.call({name, country, _id}, (err, res) => {
        if (err) {
          reject(err.reason);
        } else {
          if (res) {
            resolve(res);
          }
        }
      });
    });
  }

  _onValidate(SLA) {
    /* Field Values */
    const constraints = {
      workplace: {
        presence: {
          message: 'is required.'
        },
      },
      frequency: {
        presence: {
          message: 'is required.'
        },
        schedule: true
      },
      conditions: {
        slaConditions: true
      },
      message: {
        presence: {
          message: 'is required.'
        },
        slaMessage: true
      },
      country: {
        presence: {
          message: 'is required.'
        },
      }
    };
    const validateValue = validate(SLA, constraints);

    if (validateValue) {
      const result = Object.keys(validateValue)
        .map(v => validateValue[v].join());
      return {validated: false, detail: result};
    } else {
      return {validated: true};
    }
  }

  _onPreview(SLA) {
    this.setState({previewing: true});
    Methods.preview.call({SLA}, (err, res) => {
      if (err) {
        Notify.error({
          title: 'Preview SLA',
          message: err.message
        });
        return this.setState({previewing: false});
      } else {
        const {message, queries} = res;
        return this.setState({
          previewMessage: message,
          previewQueries: queries
        });
      }
    });
  }

  _onCreateSLA(SLA) {
    Methods.create.call(SLA, (err, res) => {
      if (err) {
        Notify.error({
          title: 'CREATE_SLA',
          message: err.message
        });
        this.setState({saving: false});
      } else {
        Notify.info({
          title: 'CREATE_SLA',
          message: 'Success.'
        });
        return this.setState({saving: false}, this.onClickCancel);
      }
    });
  }

  _onEditSLA(SLA) {
    const result = Methods.edit.call(SLA, (err, res) => {
      if (err) {
        Notify.error({
          title: 'EDIT_SLA',
          message: err.message
        });
        this.setState({saving: false});
      } else {
        Notify.info({
          title: 'EDIT_SLA',
          message: 'Success.'
        });
        return this.setState({saving: false}, this.onClickCancel);
      }
    });
  }

  _onDraft(_id, SLA) {
    this.setState({saving: true});
    if (_.isEmpty(SLA)) {
      Notify.error({
        title: 'SLA save as draft',
        message: 'SLA not found.'
      });
    }
    try {
      let result = null;
      if (_id) {
        // edit SLA
        result = this._onEditSLA({...SLA, _id, status: 'draft'});
      } else {
        // create SLA
        result = this._onCreateSLA({...SLA, status: 'draft'});
      }
    } catch (err) {
      Notify.error({
        title: 'SLA save as draft',
        message: err.message
      });
      this.setState({saving: false});
    }
  }

  _onSave(_id, SLA) {
    this.setState({saving: true});
    if (_.isEmpty(SLA)) {
      Notify.error({
        title: 'SLA save',
        message: 'SLA not found.'
      });
    }
    try {
      let result = null;
      if (_id) {
        // edit SLA
        result = this._onEditSLA({...SLA, _id, status: 'active'});
      } else {
        // create SLA
        result = this._onCreateSLA({...SLA, status: 'active'});
      }
    } catch (err) {
      Notify.error({
        title: 'SLA save',
        message: err.message
      });
      this.setState({saving: false});
    }
  }

  _onExecute(_id, SLA) {
    if (_.isEmpty(SLA)) {
      Notify.error({
        title: 'SLA execute',
        message: 'SLA not found.'
      });
    }
    Methods.preview.call({SLA}, (err, res) => {
      if (err) {
        Notify.error({
          title: 'Preview SLA',
          message: err.reason
        });
        return this.setState({previewing: false});
      } else {
        const
          {message} = res,
          {workplace} = SLA;
        Notify.info({title: 'SLA executing', message: ''});
        Methods.postMessage.call({workplace, message}, (err, res) => {
          if(err) {
            Notify.error({
              title: 'SLA execute',
              message: err.reason
            });
            this.setState({executing: false});
          } else {
            Notify.info({
              title: 'SLA execute',
              message: `Success: posted with id - ${res.id}`
            });
            this.setState({executing: false, saving: true});
            try {
              let result = null;

              if (_id) {
                // edit SLA
                result = this._onEditSLA({...SLA, _id, status: 'active'});
              } else {
                // create SLA
                result = this._onCreateSLA({...SLA, status: 'active'});
              }
              this.setState({saving: false});
            } catch (err) {
              Notify.error({
                title: 'SLA execute',
                message: err.message
              });
              this.setState({saving: false});
            }
          }
        });
      }
    });
  }

  _closeDialog() {
    this.setState({previewing: false});
  }

  onClickValidateAndPreview() {
    const {SLA} = this.props;
    const newSLA = this._getSLA();
    let slaId = null;
    !_.isEmpty(SLA) && (slaId = SLA._id);
    this.setState({validating: true});
    this._onValidateName(newSLA.country, newSLA.name, slaId)
      .then(res => {
        const {validated, detail} = res;
        if (!validated) {
          Notify.error({
            title: 'Validate and Preview',
            message: detail[0]
          });
          this.setState({validating: false});
        } else {
          const {validated, detail} = this._onValidate(newSLA);
          if (!validated) {
            Notify.error({
              title: 'Validate and Preview',
              message: detail[0]
            });
            return this.setState({validating: false});
          } else {
            Notify.info({
              title: 'Validate and Preview',
              message: 'SLA is valid.'
            });
            // preview the SLA
            return this.setState({validating: false}, () => this._onPreview(newSLA));
          }

        }
      })
      .catch(err => {
        Notify.error({
          title: 'Validate and Preview',
          message: err.message
        });
        return this.setState({validating: false});
      })
  }

  onClickSaveAsDraft() {
    const {SLA} = this.props;
    const newSLA = this._getSLA();
    let slaId = null;
    !_.isEmpty(SLA) && (slaId = SLA._id);
    this.setState({validating: true});
    this._onValidateName(newSLA.country, newSLA.name, slaId)
      .then(res => {
        const {validated, detail} = res;
        if (!validated) {
          Notify.error({
            title: 'Save as Draft',
            message: detail[0]
          });
          this.setState({validating: false});
        } else {
          const {validated, detail} = this._onValidate(newSLA);
          // Warning user if SLA is invalid
          if (!validated) {
            Notify.warning({
              title: 'Save as Draft',
              message: detail[0]
            });
          }
          return this.setState({validating: false}, () => this._onDraft(slaId, newSLA));
        }
      })
      .catch(err => {
        Notify.error({
          title: 'Save as Draft',
          message: err.message
        });
        return this.setState({validating: false});
      })
  }

  onClickSave() {
    const {SLA} = this.props;
    const newSLA = this._getSLA();
    let slaId = null;
    !_.isEmpty(SLA) && (slaId = SLA._id);
    this.setState({validating: true});
    this._onValidateName(newSLA.country, newSLA.name, slaId)
      .then(res => {
        const {validated, detail} = res;
        if (!validated) {
          Notify.error({
            title: 'Save',
            message: detail[0]
          });
          this.setState({validating: false});
        } else {
          const {validated, detail} = this._onValidate(newSLA);
          if (!validated) {
            Notify.error({
              title: 'Save',
              message: detail[0]
            });
            return this.setState({validating: false});
          } else {
            Notify.info({
              title: 'Save',
              message: 'SLA is valid.'
            });
            // preview the SLA
            this.setState({validating: false});
            return this._onSave(slaId, newSLA);
          }

        }
      })
      .catch(err => {
        Notify.error({
          title: 'Save',
          message: err.message
        });
        return this.setState({validating: false});
      });
  }

  onClickSaveAndExecute() {
    const {SLA} = this.props;
    const newSLA = this._getSLA();
    let slaId = null;
    !_.isEmpty(SLA) && (slaId = SLA._id);
    this.setState({validating: true});
    this._onValidateName(newSLA.country, newSLA.name, slaId)
      .then(res => {
        const {validated, detail} = res;
        if (!validated) {
          Notify.error({
            title: 'Save and Execute',
            message: detail[0]
          });
          this.setState({validating: false});
        } else {
          const {validated, detail} = this._onValidate(newSLA);
          if (!validated) {
            Notify.error({
              title: 'Save and Execute',
              message: detail[0]
            });
            return this.setState({validating: false});
          } else {
            Notify.info({
              title: 'Save and Execute',
              message: 'SLA is valid.'
            });
            // preview the SLA
            this.setState({validating: false, executing: true});
            return this._onExecute(slaId, newSLA);
          }

        }
      })
      .catch(err => {
        Notify.error({
          title: 'Save and Execute',
          message: err.message
        });
        return this.setState({validating: false});
      });
  }

  onClickCancel() {
    FlowRouter.setQueryParams({mode: 'list', id: null})
  }

  _renderDialog() {
    const {
      previewing, showPreviewQuery,
      previewMessage, previewQueries
    } = this.state;

    if (!previewing) {
      return null;
    }

    return (
      <Dialog
        modal={true}
        width={600}
        bodyClass="text-left"
        header="Preview SLA"
        confirmLabel="Ok"
        hasCancel={false}
        onAction={this._closeDialog}
      >
        <div className="form-body">
          <div className="form-group">
            <div className="caption">
              <i className="icon-edit font-dark"/>
              <span className="caption-subject font-dark bold uppercase">Message:</span>
            </div>
            <div className="alert alert-info">
              <ReactMarkdown
                source={previewMessage}
              />
            </div>
          </div>
          <div className="form-group form-inline">
            <div className="mt-checkbox-list">
              <label className="mt-checkbox mt-checkbox-outline">{' show Query'}
                <Checkbox
                  className="form-control"
                  value={showPreviewQuery}
                  handleOnChange={this._onShowPreviewQuery}
                />
                <span></span>
              </label>
            </div>
          </div>
          {showPreviewQuery && (
            <div className="form-group">
              <div className="caption">
                <i className="icon-edit font-dark"/>
                <span className="caption-subject font-dark bold uppercase">Queries</span>
              </div>
              {previewQueries.map((q, i) => (
                <div className="alert alert-info" key={i}>
                  <ReactMarkdown
                    source={`\n${JSON.stringify(q, null, 2)}\n`}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </Dialog>
    );
  }

  render() {
    const {ready, mode, SLA, WPs,} = this.props;
    const {executing, previewing, saving, validating} = this.state;
    const disabled = executing || previewing || saving || validating;
    const
      isEditMode = mode === 'edit',
      buttons = [
        {
          id: 'validate_preview', label: 'Validate & Preview',
          disabled: disabled,
          className: 'btn-info', type: 'button', onClick: this.onClickValidateAndPreview
        },
        {
          id: 'draft', label: 'Save as Draft',
          disabled: disabled,
          className: 'green', type: 'button', onClick: this.onClickSaveAsDraft
        },
        {
          id: 'save', label: 'Save',
          disabled: disabled,
          className: 'green', type: 'button', onClick: this.onClickSave
        },
        {
          id: 'save_execute', label: 'Save & Execute',
          disabled: disabled,
          className: 'green', type: 'button', onClick: this.onClickSaveAndExecute
        },
        {
          id: 'cancel', label: 'Cancel',
          disabled: disabled,
          className: 'btn-default', type: 'button', onClick: this.onClickCancel
        }
      ],
      defaultFrequency = {
        preps: 'on the',
        range: 'first',
        unit: 'day of the week',
        preps2: '',
        range2: '',
      },
      wpOptions = WPs.map(w => ({
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
          {/* Dialog */}
          {this._renderDialog()}
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

export default createContainer(() => {
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