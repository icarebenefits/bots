import React, {Component} from 'react';
import _ from 'lodash';
import moment from 'moment';

import {Condition} from './Condition';
import Button from '../Button';
import {Dialog} from './Dialog';
import {Form} from './Form';
import {Schema} from './schema';

export class ConditionGroup extends Component {

  constructor() {
    super();

    this.state = {
      conditions: this.getDefaultConditions(),
      dialog: {}, // get field had been change, {row, fieldId}
      hidden: true, // flag for second value of dialog form,
    };

    // handlers
    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.handleRemoveCondition = this.handleRemoveCondition.bind(this);
    this.handleInsertCondition = this.handleInsertCondition.bind(this);

    // helpers
    this.getDescription = this.getDescription.bind(this);

    // dialog
    this._renderDialog = this._renderDialog.bind(this);
    this._createFormFields = this._createFormFields.bind(this);
    this._saveDataDialog = this._saveDataDialog.bind(this);
    this._closeDialog = this._closeDialog.bind(this);
    this._saveDataDialog = this._saveDataDialog.bind(this);

    // internal
    this._addCondition = this._addCondition.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const {conditions} = nextProps;
    this.setState({conditions});
  }

  handleFieldChange(row, key, value, index) {

    const
      {conditions} = this.state,
      condition = conditions[row];
    let
      newCond = {},
      newConditions = [],
      dialog = null
      ;

    // handle for values change
    if (key === 'values') {
      const
        {values} = condition,
        newValues = []
        ;

      if (_.isEmpty(values)) {
        newValues.push(value);
      } else {
        // console.log({values, idx, value});
        values.map((val, idx) => {
          console.log('change values');
          console.log(idx);
          if (idx === index) {
            newValues.push(value);
          } else {
            newValues.push(val);
          }
        });
      }

      newCond = {...condition, [`${key}`]: newValues};
    } else {
      newCond = {...condition, [`${key}`]: value};
    }

    // console.log('handleFieldChange');
    // console.log(newCond);

    conditions.map((cond, idx) => {
      if (idx === row) {
        newConditions.push(newCond);
      } else {
        newConditions.push(cond);
      }
    });

    // handle for filter change - open form dialog
    if (key === 'filter') {
      const dialog = {
        row,
        // type: this.getFieldProps(value).fieldType,
        fieldId: value
      };

      return this.setState({
        dialog,
        conditions: newConditions,
        hidden: true
      });
    }

    // handle for operator change - edit fields of form dialog
    if (key === 'operator') {
      // get noOfParams of operator
      const {noOfParams} = this.getOperatorProps(value);
      if (noOfParams > 1) {
        this.setState({hidden: false});
      } else {
        this.setState({hidden: true});
      }
    }


    return this.setState({
      conditions: newConditions
    });
  }

  handleRemoveCondition(row) {
    const {conditions} = this.state;

    conditions.splice(row, 1);

    return this.setState({
      conditions
    });
  }

  handleInsertCondition(row) {
    const {conditions} = this.state;

    conditions.splice(row + 1, 0, this.getDefaultCondition());

    return this.setState({
      conditions
    });
  }

  getDefaultConditions() {
    return [{not: false, openParens: '', filter: '', operator: '', values: [], closeParens: '', bitwise: ''}];
  }

  getDefaultCondition() {
    return {not: false, openParens: '', filter: '', operator: '', values: [], closeParens: '', bitwise: ''};
  }

  getDefaultHandlers() {
    return {
      handleFieldChange: this.handleFieldChange,
      getFieldProps: this.getFieldProps,
      handleRemoveCondition: this.handleRemoveCondition,
      handleInsertCondition: this.handleInsertCondition,
      getDescription: this.getDescription,
    };
  }

  getDescription(condition) {
    console.log(condition);
    const {operator, values} = condition;
    let description = '';

    if(operator) {
      description = `${operator} `;
      if(values.length > 1) {
        values.map((value, idx) => {
          if(idx === values.length -1) {
            description = `${description} "${value}"`;
          } else {
            description = `${description} "${value}" and `;
          }
        })
      } else {
        description = `${description} "${values[0]}"`;
      }
    }

    return description;
  }

  getExpression(conditions) {
    let expression = '';

    conditions.map(condition => {
      const {not, openParens, filter, closeParens, bitwise} = condition;

      if(!_.isEmpty(filter)) {
        expression = `${expression} ${not ? '!' : ''} ${openParens} ${filter} ${this.getDescription(condition)} ${closeParens} ${bitwise}`;
      }
    });

    return expression;
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

  _renderDialog() {
    const {dialog} = this.state;

    if (_.isEmpty(dialog)) {
      return null;
    }

    const
      {dialog: {row, fieldId}} = this.state,
      {id, description, fieldType, operators} = this.getFieldProps(fieldId)
      ;
    let {fields} = this.state;

    if (_.isEmpty(fields)) {
      fields = this._createFormFields({row, id, description, fieldType, operators})
    }

    return (
      <Dialog
        modal={true}
        header={description}
        confirmLabel="Set"
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

  _createFormFields(state) {
    const
      {conditions, hidden = true} = this.state,
      {row, id, description: label, fieldType, operators} = state,
      {operator} = conditions[row],
      fields = [],
      fieldOptions = [{name: '', label: ''}],
      noOfValueSupported = 2
      ;

    operators.map(op => {
      const {id: name, description: label, noOfParams, code} = this.getOperatorProps(op);
      fieldOptions.push({name, label, noOfParams});
    });

    // operator field
    fields.push({
      id, row, label: '', type: 'select', value: operator,
      options: fieldOptions,
      handleOnChange: (value) => this.handleFieldChange(row, 'operator', value)
    });

    // values fields
    for (i = 0; i < noOfValueSupported; i++) {
      if (i !== 0) {
        fields.push({
          id: i, label: '', type: fieldType, value: conditions[row].values[i],
          handleOnChange: (value) => this.handleFieldChange(row, 'values', value.toString(), i),
          hidden: hidden
        });
      } else {
        fields.push({
          id: i, row, label: '', type: fieldType, value: conditions[row].values[i],
          handleOnChange: (value) => this.handleFieldChange(row, 'values', value.toString(), i)
        });
      }
    }


    return fields;
  }

  _saveDataDialog(action) {
    if (action === 'dismiss') {
      this._clearDescription();
    }
    this._closeDialog();
  }

  _closeDialog() {
    this.setState({
      dialog: {}
    });
  }

  _addCondition() {
    const
      {conditions} = this.state,
      condition = this.getDefaultCondition()
      ;

    conditions.push(condition);

    return this.setState({
      conditions
    });
  }

  render() {
    const
      {conditions} = this.state,
      expression = this.getExpression(conditions)
      ;
    let {handlers} = this.props;

    if (_.isEmpty(handlers)) {
      handlers = this.getDefaultHandlers();
    }

    return (
      <div className="container">
        <div className="row">
          <Button
            className="btn-default"
          >Preview</Button>
          {' '}
          <Button
            className="btn-default"
            onClick={this._addCondition}
          >Add</Button>
        </div>
        <div className="row">
          <h3>{expression}</h3>
        </div>
        <div className="row">
          <table className="table">
            <thead>
            <tr>
              <th>Not</th>
              <th>Parens</th>
              <th>Filter</th>
              <th>Description</th>
              <th>Parens</th>
              <th>And/Or</th>
              <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            {conditions.map((condition, idx) => {
              return (
                <Condition
                  key={idx}
                  id={idx}
                  ref={`condition-${idx}`}
                  condition={condition}
                  handlers={handlers}
                />
              );
            })}
            </tbody>
          </table>
        </div>
        <div className="row">
          {this._renderDialog()}
        </div>
      </div>
    );
  }
}