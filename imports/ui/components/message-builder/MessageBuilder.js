/**
 * Created by vinhcq on 3/15/17.
 */
import React, {Component, PropTypes} from 'react';

import {
  FormInput,
  Label,
  Button,
} from '../elements';

import * as Notify from '/imports/api/notifications';
import template from "string-template";


class MessageBuilder extends Component {

  constructor(props) {
    super(props);

    const {summaryType = '', field = '', varName = '', template = ''} = props.message;

    this.state = {
      summaryType,
      field,
      varName,
      template,
    };
  }

  handleCheck(e) {
    e.preventDefault();
    const message = this.refs.template.getValue();
    console.log(message);
    const varName = this.refs.varName.getValue();
    const countLeft = (message.match(/{/g) || []).length;
    const countRight = (message.match(/}/g) || []).length;
    if (countLeft === countRight && countLeft > 0 && message.indexOf('{' + varName + '}') > 0) {
      const values = {};
      values[varName] = 120;
      console.log(values);
      const sample = template(message, values);
      Notify.success({title: 'Message builder', message: `Message sample: "${sample}"`});
    } else {
      Notify.warning({title: 'Message builder', message: 'Message invalid.'});
      console.log(countLeft + "!=" + countRight);
    }
  }

  _handleFieldChange(field, value) {
    // console.log("field:" + field + " value:" + value);
    this.setState({
      [field]: value
    });
  }

  getData() {
    return this.state;
  }

  render() {
    const {summaryType, field, varName, template} = this.state;
    const {readonly} =this.props;
    // console.log(readonly);
    // console.log('message', this.state);
    return (
      <div>
        <Label
          className="col-md-12 uppercase bold pull-left"
          value="Message Builder"
        />
        <div className="row" style={{marginBottom: 20}}>
          <div className="col-md-3">
            <Label
              className="col-md-3 pull-left"
              value="SummaryType"
            />
            {readonly ?
              <Label
                className="col-md-3 form-control pull-left"
                value={summaryType}
              /> :
              <FormInput
                ref="summaryType"
                type="select"
                className="form-control"
                value={summaryType}
                options={[
                {name: '', label: ''},
                {name: 'count', label: 'count'},
                {name: 'sum', label: 'sum'},
                {name: 'average', label: 'average'},
              ]}
                handleOnChange={value => this._handleFieldChange('summaryType', value)}
              />
            }

          </div>
          <div className="col-md-3">
            <Label
              className="col-md-3 pull-left"
              value="CustomField"
            />
            {readonly ?
              <Label
                className="col-md-3 form-control pull-left"
                value={field}
              /> :
              <FormInput
                ref="field"
                type="select"
                className="form-control "
                value={field}
                options={[
                {name: '', label: ''},
                {name: 'iCM', label: 'iCM'},
                {name: 'customer', label: 'customer'},
                {name: 'ticket', label: 'ticket'},
                {name: 'bill', label: 'bill'},
                {name: 'amount', label: 'amount'},
              ]}
                handleOnChange={value => this._handleFieldChange('field', value)}
              />
            }
          </div>
          <div className="col-md-3">
            <Label
              className="col-md-3 pull-left"
              value="Variable"
            />
            {readonly ?
              <Label
                className="col-md-3 form-control pull-left"
                value={varName}
              /> :
              <FormInput
                ref="varName"
                type="text"
                value={varName}
                className="form-control"
                placeholder="variable"
                handleOnChange={value => this._handleFieldChange('varName', value)}
              />
            }
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <Label
              className="col-md-12 pull-left"
              value="Template"
            />
            <div className="col-md-6">
              {readonly ?
                <Label
                  className="col-md-6 form-control pull-left"
                  value={template}
                /> :
                <FormInput
                  ref="template"
                  type="text"
                  value={template}
                  className="form-control"
                  placeholder="message template"
                  handleOnChange={value => this._handleFieldChange('template', value)}
                />}
            </div>
            {readonly ? null :
              < div className="col-md-2">
                <Button
                  className="green"
                  onClick={e => this.handleCheck(e)}
                >Preview</Button>
              </div>
            }
          </div>

        </div>
      < / div >
    )

  }
}

MessageBuilder.propTypes = {
  message: PropTypes.shape({
    summaryType: PropTypes.string,
    field: PropTypes.string,
    varName: PropTypes.string,
    template: PropTypes.string,
  }).isRequired,
};

export default MessageBuilder