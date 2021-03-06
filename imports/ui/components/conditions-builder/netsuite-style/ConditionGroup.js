import React, {Component} from 'react';
import _ from 'lodash';

import {
  // Button,
  Dialog,
  Form,
  Label,
} from '../../elements';
import {Condition} from './Condition';
// import {Fields} from '/imports/api/fields';
import {Schema} from './schema';

export class ConditionGroup extends Component {

  constructor(props) {
    super(props);

    this.state = {
      conditions: !_.isEmpty(props.conditions) ? props.conditions : this.getDefaultConditions(),
      dialog: {}, // get field had been change, {row, fieldId}
      hidden: true, // flag for second value of dialog form,
      edit: 0,
    };

    // handlers
    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.handleRemoveCondition = this.handleRemoveCondition.bind(this);
    this.handleInsertCondition = this.handleInsertCondition.bind(this);
    this._handleClickCondition = this._handleClickCondition.bind(this);

    // helpers
    this._clearDescription = this._clearDescription.bind(this);
    this.getDescription = this.getDescription.bind(this);

    // dialog
    this._renderDialog = this._renderDialog.bind(this);
    this._createFormFields = this._createFormFields.bind(this);
    this._saveDataDialog = this._saveDataDialog.bind(this);
    this._closeDialog = this._closeDialog.bind(this);

    // internal
    this._addCondition = this._addCondition.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const {conditions} = nextProps;
    if (!_.isEmpty(conditions))
      this.setState({conditions});
  }

  getConditions() {
    return this.state.conditions;
  }

  _addCondition(e) {
    e.preventDefault();
    const
      {conditions} = this.state,
      condition = this.getDefaultCondition()
      ;

    if (!_.isEmpty(conditions)) {
      const {filter, operator, values} = conditions[0];
      if (_.isEmpty(filter) || _.isEmpty(operator) || _.isEmpty(values)) {
        return alert(`Please enter value(s) for Filter, Description`);
      }
    }

    conditions.push(condition);

    return this.setState({
      conditions,
      edit: conditions.length - 1
    });
  }

  _handleClickCondition(e) {
    const {row} = e.target.dataset;

    console.log(row);
    this.setState({
      edit: row
    });
  }

  handleFieldChange(row, key, value, index) {

    const
      {conditions} = this.state,
      condition = conditions[row];
    let
      newCond = {},
      newConditions = []
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
        values.map((val, idx) => {
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
      conditions,
      edit: row - 1 // enable editable for previous row
    });
  }

  handleInsertCondition(row) {
    const {conditions} = this.state;

    conditions.splice(row + 1, 0, this.getDefaultCondition());

    return this.setState({
      conditions,
      edit: row + 1 // enable edited row for new row inserted
    });
  }

  _clearDescription() {
    const {conditions, edit: row} = this.state;

    const newConds = conditions.reduce((newConds, condition, idx) => {
      (idx === row)
        ? newConds.push({...condition, values: [], operator: ''})
        : newConds.push(condition);
      return newConds;
    }, []);

    return newConds;
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
      handleClickCondition: this._handleClickCondition,
      getDescription: this.getDescription,
    };
  }

  getDescription(condition) {
    const {operator, values} = condition;
    let description = '';

    if (operator) {
      description = `${operator} `;
      if (values.length > 1) {
        values.map((value, idx) => {
          if (idx === values.length - 1) {
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

  getExpression(conditions = []) {
    let expression = '';

    conditions.map(condition => {
      const {not, openParens, filter, closeParens, bitwise} = condition;

      if (!_.isEmpty(filter)) {
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
      {row, id, fieldType, operators} = state,
      {operator} = conditions[row],
      fields = [],
      fieldOptions = [{name: '', label: ''}],
      noOfValueSupported = 2
      ;

    operators.map(op => {
      const {id: name, description: label, noOfParams} = this.getOperatorProps(op);
      fieldOptions.push({name, label, noOfParams});
    });

    // operator field
    fields.push({
      id, row, label: '', type: 'select', value: operator,
      options: fieldOptions,
      handleOnChange: (value) => this.handleFieldChange(row, 'operator', value)
    });

    // values fields
    for (let i = 0; i < noOfValueSupported; i++) {
      if (i !== 0) {
        // console.log(i);
        fields.push({
          id: i, label: '', type: fieldType, value: conditions[row].values[i],
          handleOnChange: (value) => this.handleFieldChange(row, 'values', value.toString(), this.id),
          hidden: hidden
        });
      } else {
        // console.log(i);
        fields.push({
          id: i, row, label: '', type: fieldType, value: conditions[row].values[i],
          handleOnChange: (value) => this.handleFieldChange(row, 'values', value.toString(), this.id)
        });
      }
    }


    return fields;
  }

  _saveDataDialog(action) {
    console.log('saveDialog', action);
    let newConds = [];
    if (action === 'dismiss') {
      newConds = this._clearDescription();
    }
    console.log(newConds)
    this._closeDialog(newConds);
  }

  _closeDialog(newConds) {
    if (!_.isEmpty(newConds)) {
      this.setState({
        dialog: {},
        conditions: newConds
      })
    } else {
      this.setState({
        dialog: {}
      });
    }
  }

  render() {
    const
      {conditions, edit} = this.state
      ;
    let {handlers, readonly} = this.props;

    if (_.isEmpty(handlers)) {
      handlers = this.getDefaultHandlers();
    }

    console.log('conditions', conditions);

    return (
      <div className="col-md-12">
        <div className="row">
          <Label
            className="col-md-12 bold uppercase pull-left"
            value="Conditions: "
          />
          {/* <h5>{expression}</h5>*/}
        </div>
        {/*readonly
          ? null
          : <div className="row">
              <Button
                className="btn-default pull-right"
                onClick={e => this._addCondition(e)}
              ><span className="glyphicon glyphicon-plus"></span>{' Add'}</Button>
            </div>
        */}
        <div className="row">
          <table className="table table-striped">
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
            <tbody
              onDoubleClick={this._handleClickCondition}
            >
            {conditions.map((condition, idx) => {
              return (
                <Condition
                  key={idx}
                  id={idx}
                  ref={`condition-${idx}`}
                  condition={condition}
                  readonly={readonly || (Number(edit) === idx ? false : true)}
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