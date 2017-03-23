/**
 * Created by vinhcq on 3/15/17.
 */
import React, {Component, PropTypes} from 'react';

// Fields
import {Fields, FieldsGroups} from '/imports/api/fields';

import {
  Dialog,
  FormInput,
  Label,
  Button,
} from '../elements';
import {Variable} from './Variable';
import * as Notify from '/imports/api/notifications';
import template from "string-template";
import _ from 'lodash';


class MessageBuilder extends Component {

  constructor(props) {
    super(props);

    const {
      variables = [{
        summaryType: '',
        field: '',
        name: '',
      }],
      messageTemplate = '',
    } = props.message;

    this.state = {
      variables,
      messageTemplate,
      dialog: {}, // get field had been change, {row, groupId, fieldId}
    };

    // handlers
    this.handleComboFieldChange = this.handleComboFieldChange.bind(this);
    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.handleRemoveRow = this.handleRemoveRow.bind(this);

    // dialog
    this._renderDialog = this._renderDialog.bind(this);
    this._saveDataDialog = this._saveDataDialog.bind(this);
    this._closeDialog = this._closeDialog.bind(this);
  }

  handleCheck(e) {
    e.preventDefault();

    // console.log(this.state);
    const {variables, messageTemplate} = this.state;
    const countLeft = (messageTemplate.match(/{/g) || []).length;
    const countRight = (messageTemplate.match(/}/g) || []).length;
    if (countLeft === countRight && countLeft > 0) {
      const values = {};
      let numOfValues = 0;
      let hasInvalidVariable = false;
      variables.map((v) => {
        const {summaryType, field, name} =v;
        if (messageTemplate.indexOf('{' + name + '}') >= 0) {
          values[name] = Math.floor(Math.random() * (1000 + 1) + 12);
          numOfValues++;
        }
        if (_.isEmpty(summaryType) || _.isEmpty(field) || _.isEmpty(name))
          hasInvalidVariable = true;
      });
      // console.log(values);
      if (hasInvalidVariable) {
        Notify.warning({title: 'Message invalid', message: 'There are INVALID variable'});
      } else if (variables.length != numOfValues || numOfValues != countLeft) {
        Notify.warning({title: 'Message invalid', message: 'Template DO NOT match with given variables'});
      } else {
        const sample = template(messageTemplate, values);
        Notify.success({title: 'Message Sample:', message: ` "${sample}"`});
      }
    } else {
      Notify.warning({title: 'Message invalid', message: 'Template is INVALID '});
    }
  }

  _getDefaultVariable() {
    return {
      summaryType: '',
      field: '',
      name: '',
    }
  }

  handleRemoveRow(row) {
    const {variables} = this.state;
    variables.splice(row, 1);
    return this.setState({
      variables,
    });
  }

  _addRow(e) {
    e.preventDefault();
    const {variables} = this.state;
    variable = this._getDefaultVariable()
    ;
    variables.push(variable);

    return this.setState({
      variables,
    });
  }

  handleFieldChange(row, key, value) {
    const
      {variables} = this.state,
      variable = variables[row]
      ;
    let newVar = {};

    if(key === 'field') {
      const {groupId, value: val} = value;
      newVar = {...variable, [`${key}`]: val};
    } else {
      newVar = {...variable, [`${key}`]: value};
    }

    const newVariables = variables.map((c, i) => {
      if (i === row) {
        return newVar;
      } else {
        return c;
      }
    });

    this.setState({
      dialog: {
        row,
        fieldId: value
      }
    });
    // console.log("newVariables", newVariables);
    return this.setState({
      variables: newVariables
    });
  }

  handleComboFieldChange(row, key, value) {
    const
      {variables} = this.state,
      variable = variables[row];
    let newVar = {...variable, [`${key}`]: value};
    const newVariables = variables.map((c, i) => {
      if (i === row) {
        return newVar;
      } else {
        return c;
      }
    });

    return this.setState({
      variables: newVariables,
      dialog: {}
    });
  }

  _handleFieldChange(field, value) {
    this.setState({
      [field]: value
    });
  }

  getDefaultHandlers() {
    return {
      handleFieldChange: this.handleFieldChange,
      handleRemoveRow: this.handleRemoveRow,
    };
  }

  getData() {
    return this.state;
  }

  _saveDataDialog(action) {
    this.setState({
      dialog: {}
    });
  }

  _closeDialog(newConds) {
    if (!_.isEmpty(newConds)) {
      this.setState({
        dialog: {},
        variables: newConds
      })
    } else {
      this.setState({
        dialog: {}
      });
    }
  }


  _renderDialog() {
    const {dialog} = this.state;

    if (_.isEmpty(dialog)) {
      return null;
    }

    const
      {dialog: {row, fieldId}, variables, values} = this.state;

    if (_.isEmpty(fieldId)) {
      return null;
    }
    const FieldGroup = FieldsGroups[groupId],
      {props, fields: FieldData} = FieldGroup,
      {fields, operators, props: {name: header}} = FieldData[fieldId](),
      {summaryType, field, name} = variables[row]
      ;

    if (fields) {
      // Dialog field props
      const options = Object.keys(fields)
          .map(f => {
            const {id: name, name: label} = fields[f].props;
            return {name, label};
          })
        ;
      options.splice(0, 0, {name: '', label: ''}); // default option

      return (
        <Dialog
          modal={true}
          header={header}
          confirmLabel="Set"
          hasCancel={true}
          onAction={this._saveDataDialog}
        >
          <div className="form-body">
            <div className="form-group">
              <FormInput
                ref="field"
                type="select"
                options={options}
                handleOnChange={value => this.handleComboFieldChange(row, 'field', value)}
              />
            </div>
          </div>
        </Dialog>
      );
    }
  }

  render() {
    const {variables, messageTemplate} = this.state;
    let {handlers, readonly} = this.props;
    if (_.isEmpty(handlers)) {
      handlers = this.getDefaultHandlers();
    }

    return (
      <div className="col-md-12">
        <div className="row">
          <div className="col-md-12">
            <Label
              className="uppercase bold pull-left"
              value="Message Builder"
            />
            {readonly
              ? null
              : <Button
              className="btn-default pull-right"
              onClick={e => this._addRow(e)}
            ><span className="fa fa-plus"></span>{' Add'}</Button>
            }
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <table className="table table-striped">
              <thead>
              <tr>
                <th>summaryType</th>
                <th>Field</th>
                <th>Variable</th>
                <th>Actions</th>
              </tr>
              </thead>
              <tbody
              >
              {variables.map((variable, idx) => {
                return (
                  <Variable
                    key={idx}
                    id={idx}
                    ref={`var-${idx}`}
                    variable={variable}
                    readonly={readonly}
                    handlers={handlers}
                  />
                );
              })}
              </tbody>
            </table>
          </div>
        </div>
        <div className="row">
          <Label
            className="col-md-12 bold pull-left"
            value="Template"
          />
          </div>
        <div className="row">
          <div className="col-md-8">
            {readonly ?
              <Label
                className="col-md-8 form-control pull-left"
                value={messageTemplate}
              /> :
              <FormInput
                ref="messageTemplate"
                multiline={true}
                type="text"
                value={messageTemplate}
                className="form-control"
                placeholder="message messageTemplate"
                handleOnChange={value => this._handleFieldChange('messageTemplate', value)}
              />
            }
            <div className="">
              <Label className="small col-md-10 pull-left"
                     value="Ex: There are {icm} customers who has less than 110 iCare Members."/>
            </div>
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
    )

  }
}

MessageBuilder.propTypes = {
  message: PropTypes.shape({
    messageTemplate: PropTypes.string,
  }).isRequired,
};

export default MessageBuilder