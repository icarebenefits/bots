import React, {Component} from 'react';
import _ from 'lodash';

import {Checkbox} from './Checkbox';
import {Selectbox} from './Selectbox';
import {Label} from './Label';
import {Button} from './Button';
// import Dialog from '../Dialog';
import {Dialog} from './Dialog';
import {Form} from './Form';
import {Schema} from './schema';

export class AllElements extends Component {

  constructor() {
    super();

    this.state = {
      not: false,
      filter: null,
      dialog: null, // get field had been change,
      hidden: true, // flag for second value of dialog form,
      operator: '',
      values: [''],
    };

    this._handleNotChange = this._handleNotChange.bind(this);
    this._handleFieldChange = this._handleFieldChange.bind(this);
    this._handleButtonClick = this._handleButtonClick.bind(this);
    this._handleOperatorChange = this._handleOperatorChange.bind(this);
    this._handleValue1Change = this._handleValue1Change.bind(this);
    this._handleValue2Change = this._handleValue2Change.bind(this);
    this._saveDataDialog = this._saveDataDialog.bind(this);
    this._closeDialog = this._closeDialog.bind(this);
    this._saveDataDialog = this._saveDataDialog.bind(this);
  }

  _handleNotChange(value) {
    return this.setState({not: value});
  }

  _handleFieldChange(value) {
    return this.setState({
      filter: value,
      dialog: value,
    })
  }

  _handleButtonClick(action) {
    console.log(action);
  }

  _handleOperatorChange(operator) {
    const {noOfParams} = this.getOperatorProps(operator);
    if(noOfParams > 1) {
      return this.setState({
        operator,
        hidden: false,
      });
    }
    return this.setState({
      operator
    });
  }

  _handleValue1Change(value) {
    console.log('value1');
    console.log(value);
    const
      {values} = this.state,
      newValues = [value, values[1]]
      ;

    return this.setState({
      values: newValues
    });
  }

  _handleValue2Change(value) {
    console.log('value2');
    console.log(value);
    const
      {values} = this.state,
      newValues = [values[0], value]
      ;

    return this.setState({
      values: newValues
    });
  }

  _saveDataDialog(action) {
    this._closeDialog();
  }

  getFieldProps(fieldId) {
    const {
      id,
      description,
      fieldType,
      operators
    } = Schema.fields[fieldId];

    return {
      id,
      description,
      fieldType,
      operators
    };
  }

  getOperatorProps(op) {
    const {
      id,
      description,
      noOfParams,
      code,
    } = Schema.operators[op];

    return {
      id,
      description,
      noOfParams,
      code,
    };
  }

  createFormFields(state) {

    const
      {operator, values, hidden} = this.state,
      {id, description: label, fieldType, operators} = state,
      fields = [],
      fieldOptions = [{name: '', label: ''}]
      ;

    operators.map(op => {
      const {id: name, description: label, noOfParams, code} = this.getOperatorProps(op);
      fieldOptions.push({name, label, noOfParams});
    });

    // operator field
    fields.push({
      id, label: '', type: 'select', value: operator || '',
      options: fieldOptions,
      handleOnChange: (value) => this._handleOperatorChange(value)
    });
    // first value field
    fields.push({
      id: 'value1', label: '', type: fieldType, value: values[0] || '',
      handleOnChange: (value) => this._handleValue1Change(value)
    });
    // second value field
    fields.push({
      id: 'value2', label: '', type: fieldType, value: values[1] || '',
      handleOnChange: (value) => this._handleValue2Change(value),
      hidden: hidden
    });

    return fields;
  }

  _renderDialog() {
    const {dialog} = this.state;

    if (!dialog) {
      return null;
    }

    return this._renderFormDialog(dialog);
  }

  _renderFormDialog(field) {
    // get information of field to render Form
    const {id, description, fieldType, operators} = this.getFieldProps(field);
    // console.log({id, description, fieldType, operators});

    const fields = this.createFormFields({id, description, fieldType, operators});
    // console.log(formData);

    console.log(fields)
    return (
      <Dialog
        modal={true}
        header={description}
        confirmLabel={'Set'}
        hasCancel={true}
        onAction={this._saveDataDialog}
      >
        <Form
          ref="form"
          fields={fields}
        />
      </Dialog>
    );
  }

  _closeDialog() {
    this.setState({
      dialog: null
    });
  }

  render() {
    const
      {listFields} = Schema,
      filters = [{name: '', label: ''}],
      {not, filter, operator, values} = this.state,
      description = (operator ? `${operator} ${values.length > 1 ? values.join(' and ') : values[0]}` : ''),
      expression = (filter ? `Expression: ${not ? '!' : ''} ${filter} ${description}` : '')
      ;

    console.log(values);

    listFields.map(fieldId => {
      const {id: name, description: label} = this.getFieldProps(fieldId);
      filters.push({name, label});
    });

    // console.log(this.state.dialog);
    // console.log(this.state.hidden);

    return (
      <div className="container">
        <div className="row">
          <Checkbox
            value={not}
            handleOnChange={this._handleNotChange}
          />
        </div>
        <div className="row">
          <Selectbox
            value={filter || ''}
            options={filters}
            handleOnChange={this._handleFieldChange}
          />
        </div>
        <div className="row">
          <Label value={description} />
        </div>
        <div className="row">
          <Button
            name="create"
            label='Create'
            type="button"
            handleOnClick={this._handleButtonClick}
          />
        </div>
        <div className="row">
          <Label value={expression} />
        </div>
        <div className="row">
          {this._renderDialog()}
        </div>
      </div>
    );
  }
}