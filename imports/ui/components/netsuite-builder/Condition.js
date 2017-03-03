import React, {Component} from 'react';
import _ from 'lodash';
import moment from 'moment';

import {Checkbox} from './Checkbox';
import {Selectbox} from './Selectbox';
import {Label} from './Label';
import {Dialog} from './Dialog';
import {Form} from './Form';
import {Schema} from './schema';
import Button from '../Button';

export class Condition extends Component {

  constructor() {
    super();

    this.state = {
      not: false,
      openParens: '',
      filter: null,
      operator: '',
      value1: '',
      value2: '',
      closeParens: '',
      bitwise: '',
      dialog: null, // get field had been change,
      hidden: true, // flag for second value of dialog form,
    };

    this._clearDescription = this._clearDescription.bind(this);
    this._handleNotChange = this._handleNotChange.bind(this);
    this._handleOpenParensChange = this._handleOpenParensChange.bind(this);
    this._handleFieldChange = this._handleFieldChange.bind(this);
    this._handleCloseParensChange = this._handleCloseParensChange.bind(this);
    this._handleBitwiseChange = this._handleBitwiseChange.bind(this);
    this._handleOperatorChange = this._handleOperatorChange.bind(this);
    this._handleValue1Change = this._handleValue1Change.bind(this);
    this._handleValue2Change = this._handleValue2Change.bind(this);
    this._saveDataDialog = this._saveDataDialog.bind(this);
    this._closeDialog = this._closeDialog.bind(this);
    this._saveDataDialog = this._saveDataDialog.bind(this);
  }

  getCondition() {
    const {not, openParens, filter, operator, value1, value2, closeParens, bitwise} = this.state;

    return [not, openParens, filter, operator, value1, value2, closeParens, bitwise];
  }

  _clearDescription() {
    this.setState({
      operator: '',
      value1: '',
      value2: ''
    });
  }

  _handleNotChange(value) {
    return this.setState({not: value});
  }

  _handleOpenParensChange(value) {
    return this.setState({openParens: value});
  }

  _handleFieldChange(value) {
    const {fieldType} = this.getFieldProps(value);
    if(fieldType === 'date') {
      return this.setState({
        filter: value,
        dialog: value,
        operator: '',
        value1: null,
        value2: null
      });
    }
    return this.setState({
      filter: value,
      dialog: value,
      operator: '',
      value1: '',
      value2: ''
    })
  }

  _handleCloseParensChange(value) {
    return this.setState({closeParens: value});
  }

  _handleBitwiseChange(value) {
    return this.setState({bitwise: value});
  }

  _handleOperatorChange(operator) {
    const {noOfParams} = this.getOperatorProps(operator);
    if (noOfParams > 1) {
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
    return this.setState({
      value1: value
    });
  }

  _handleValue2Change(value) {
    return this.setState({
      value2: value
    });
  }

  _saveDataDialog(action) {
    if(action === 'dismiss') {
      this._clearDescription();
    }
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
      {operator, value1, value2, hidden} = this.state,
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
      id: 'value1', label: '', type: fieldType, value: value1,
      handleOnChange: (value) => this._handleValue1Change(value)
    });
    // second value field
    fields.push({
      id: 'value2', label: '', type: fieldType, value: value2,
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

    const fields = this.createFormFields({id, description, fieldType, operators});

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
      {id, initialCond, handleInsertCondition, handleRemoveCondition} = this.props,
      {not, openParens, filter, operator, value1, value2, closeParens, bitwise} = this.state,
      {listFields} = Schema,
      filters = [{name: '', label: ''}]
      ;
    let
      description = !_.isEmpty(operator) ? `${operator} ${value1} ${value2}` : '',
      expression = ''
      ;

    console.log(this.props);

    // get simple expression
    // operator could be replace with the code using getOperatorProps
    expression = (filter
      ? `Expression: ${not ? '!' : ''} ${openParens} ${filter} 
                      ${description} ${closeParens} ${bitwise}`
      : '');

    listFields.map(fieldId => {
      const {id: name, description: label} = this.getFieldProps(fieldId);
      filters.push({name, label});
    });

    return (
      <tr>
        <td>
          <Checkbox
            value={not}
            handleOnChange={this._handleNotChange}
          />
        </td>
        <td>
          <Selectbox
            value={openParens}
            options={[
              {name: '', label: ''},
              {name: '(', label: '('},
              {name: '((', label: '(('},
              {name: '(((', label: '((('},
            ]}
            handleOnChange={this._handleOpenParensChange}
          />
        </td>
        <td>
          <Selectbox
            value={filter || ''}
            options={filters}
            handleOnChange={this._handleFieldChange}
          />
        </td>
        <td>
          <Label value={description}/>
        </td>
        <td>
          <Selectbox
            value={closeParens}
            options={[
              {name: '', label: ''},
              {name: ')', label: ')'},
              {name: '))', label: '))'},
              {name: ')))', label: ')))'},
            ]}
            handleOnChange={this._handleCloseParensChange}
          />
        </td>
        <td>
          <Selectbox
            value={bitwise}
            options={[
              {name: '', label: ''},
              {name: 'and', label: 'And'},
              {name: 'or', label: 'Or'},
            ]}
            handleOnChange={this._handleBitwiseChange}
          />
        </td>
        <td>
          <div>
            <Button
              className="btn-default"
              onClick={e => handleInsertCondition(id)}
            >Insert</Button>
            {' '}
            <Button
              className="btn-default"
              onClick={e => handleRemoveCondition(id)}
            >Remove</Button>
          </div>
        </td>
        <td>
          {this._renderDialog()}
        </td>
      </tr>
    );
  }
}