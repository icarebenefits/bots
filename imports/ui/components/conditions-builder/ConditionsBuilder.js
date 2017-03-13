import React, {Component} from 'react';
import _ from 'lodash';
import S from 'string';

// Fields
import {Fields} from '/imports/api/fields';

import {
  Button,
  Dialog,
  FormInput,
  Label,
} from '../elements';
import {Condition} from './Condition';

class ConditionsBuilder extends Component {

  constructor(props) {
    super(props);

    this.state = {
      conditions: !_.isEmpty(props.conditions) ? props.conditions : this._getDefaultConditions(),
      dialog: {}, // get field had been change, {row, fieldId}
      edit: 0,
      values: [], // the value fields showed in dialog {type}
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
    this._saveDataDialog = this._saveDataDialog.bind(this);
    this._closeDialog = this._closeDialog.bind(this);

    // internal
    this._addCondition = this._addCondition.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const {conditions} = nextProps;
    !_.isEmpty(conditions) && this.setState({conditions});
  }

  getConditions() {
    return this.state.conditions;
  }

  _addCondition(e) {
    e.preventDefault();
    const
      {conditions} = this.state,
      condition = this._getDefaultCondition()
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
      newConditions = [],
      values = [],
      dialog = null
      ;

    // handle for values change
    if (key === 'values') {
      const
        {values} = condition,
        newValues = [];

      values.map((v, idx)=> {
        idx === index
          ? newValues.push(value)
          : newValues.push(v)
        ;
      });
      newCond = {...condition, values: newValues};
    } else {
      newCond = {...condition, [`${key}`]: value};
    }

    // handle for operator change - edit fields of form dialog
    if (key === 'operator') {
      const
        fieldId = conditions[row].filter,
        {type, params} = Fields[fieldId]().operators[value].props
        ;

      for (let i = 0; i < params - 1; i++) {
        values.push({type, value: this._getDefaultValue(type)});
      }
      // get noOfParams of operator
      // console.log({row, key, value, index})
      newCond = {...condition, values, operator: value};
      conditions.map((cond, idx) => {
        if (idx === row) {
          newConditions.push(newCond);
        } else {
          newConditions.push(cond);
        }
      });

      return this.setState({
        conditions: newConditions,
        values,
      });
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


    return this.setState({
      conditions: newConditions,
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

    conditions.splice(row + 1, 0, this._getDefaultCondition());

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

  _getDefaultValue(type) {
    switch (type) {
      case 'date':
      {
        return (new Date()).toString();
      }
      case 'number':
      {
        return 0;
      }
      case 'string':
      {
        return '';
      }
      default:
      {
        return '';
      }
    }
  }

  _getDefaultConditions() {
    return [{not: false, openParens: '', filter: '', operator: '', values: [], closeParens: '', bitwise: ''}];
  }

  _getDefaultCondition() {
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
        values.map(({type, value}, idx) => {
          if (idx === values.length - 1) {
            description = `${description} "${value}"`;
          } else {
            description = `${description} "${value}" and `;
          }
        })
      } else {
        description = `${description} "${values[0].value}"`;
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

  _renderDialog() {
    const {dialog} = this.state;

    if (_.isEmpty(dialog)) {
      return null;
    }

    const
      {dialog: {row, fieldId}, conditions, values} = this.state,
      operators = Fields[fieldId]().operators
      ;
    // Dialog props
    const
      options = Object.keys(operators)
        .map(op => {
          const {id: name, name: label} = operators[op].props;
          return {name, label};
        }),
      header = S(fieldId).capitalize().s,
      {operator, values: condValues} = conditions[row]
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
              ref="operator"
              type="select"
              value={operator}
              options={options}
              handleOnChange={value => this.handleFieldChange(row, 'operator', value)}
            />
          </div>
          {values.map((input, idx) => {
            const {type, value} = input;
            return (
              <div className="form-group" key={idx}>
                <FormInput
                  type={type}
                  value={value}
                  handleOnChange={value => this.handleFieldChange(row, 'values', value, idx)}
                />
              </div>
            );
          })}
        </div>
      </Dialog>
    );
  }

  _saveDataDialog(action) {
    console.log('saveDialog', action);
    let newConds = [];
    if (action === 'dismiss') {
      newConds = this._clearDescription();
    }
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
      {conditions, edit} = this.state,
      expression = this.getExpression(conditions)
      ;
    let {handlers, readonly} = this.props;

    if (_.isEmpty(handlers)) {
      handlers = this.getDefaultHandlers();
    }

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

export default ConditionsBuilder