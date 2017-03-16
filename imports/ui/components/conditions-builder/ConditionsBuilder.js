import React, {Component} from 'react';
import _ from 'lodash';
import moment from 'moment';
import accounting from 'accounting';

// Fields
import {Fields} from '/imports/api/fields';

import {
  Button,
  Dialog,
  FormInput,
  Label,
} from '../elements';
import {Condition} from './Condition';
import * as Notify from '/imports/api/notifications';

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
        return Notify.error({title: '', message: `Please enter value(s) for Filter, Description`});
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
    let cond = {};

    switch (key) {
      case 'filter':
      {
        cond = {
          ...condition,
          filter: _.isEmpty(value) ? '' : value,
          field: '', operator: '', values: []
        };
        this.setState({
          dialog: {
            row,
            fieldId: value
          },
          values: []
        });
        break;
      }
      case 'field':
      {
        cond = {...condition, field: value};
        break;
      }
      case 'operator':
      {
        if (_.isEmpty(value)) {
          cond = {...condition, operator: '', values: []};
        } else {
          const
            {filter, field} = conditions[row],
            newValues = []
            ;
          let FieldData = {};
          if(!_.isEmpty(field)) {
            FieldData = Object.assign({}, Fields[filter]().fields[field]);
            // {type, params} = FieldData.fields[field].operators[value].props
          } else {
            FieldData = Object.assign({}, Fields[filter]())
          }

          const {type, params} = FieldData.operators[value].props;
          for (let i = 0; i < params - 1; i++) {
            newValues.push({type, value: this._getDefaultValue(type)});
          }
          cond = {...condition, operator: value, values: newValues};
          this.setState({values: newValues});
        }
        break;
      }
      case 'values':
      {
        const {values} = condition;
        const newValues = values
          .map((v, i) => {
            return (i === index) ? (value) : v;
          });
        cond = {...condition, values: newValues};
        break;
      }
      default:
      {
        cond = {...condition, [`${key}`]: value};
      }
    }

    const newConds = conditions.map((c, i) => {
      if (i === row) {
        return cond;
      } else {
        return c;
      }
    });
    // console.log(newConds);
    return this.setState({
      conditions: newConds
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
        return '';
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
    return [{
      not: false,
      openParens: '',
      filter: '',
      field: '',
      operator: '',
      values: [],
      closeParens: '',
      bitwise: ''
    }];
  }

  _getDefaultCondition() {
    return {not: false, openParens: '', filter: '', field: '', operator: '', values: [], closeParens: '', bitwise: ''};
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
    const {field, operator, values} = condition;
    let description = '';

    if(!_.isEmpty(field)) {
      description = `${field} `;
    }
    if (operator) {
      description = `${description} ${operator} `;
      if (values.length > 1) {
        values.map(({type, value}, idx) => {
          let val = value;
          if(type === 'date') {
            val = moment(new Date(value)).format('LL');
          }
          if (idx === values.length - 1) {
            description = `${description} "${val}"`;
          } else {
            description = `${description} "${val}" and `;
          }
        })
      } else {
        const {type, value} = values[0];
        let val = value;
        if(type === 'date') {
          val = moment(new Date(value)).format('LL');
        }
        description = `${description} "${val}"`;
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
      {dialog: {row, fieldId}, conditions, values} = this.state;

    if(_.isEmpty(fieldId)) {
      return null;
    }

    const FieldData = Fields[fieldId](),
      {fields, operators, props: {name: header}} = FieldData,
      {operator, values: condValues, field} = conditions[row]
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
      // Dialog operator props
      let opOptions = [];
      if(!_.isEmpty(field)) {
        const {operators} = fields[field];
        opOptions = Object.keys(operators)
          .map(op => {
            const {id: name, name: label} = operators[op].props;
            return {name, label};
          })
        ;
        opOptions.splice(0, 0, {name: '', label: ''}); // default option
      }

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
                value={field}
                options={options}
                handleOnChange={value => this.handleFieldChange(row, 'field', value)}
              />
            </div>
            {!_.isEmpty(opOptions) && (
              <div className="form-group">
                <FormInput
                  ref="operator"
                  type="select"
                  value={operator}
                  options={opOptions}
                  handleOnChange={value => this.handleFieldChange(row, 'operator', value)}
                />
              </div>
            )}
            {!_.isEmpty(opOptions) && (
              values.map((input, idx) => {
                const {type, value} = input;
                return (
                  <div className="form-group" key={idx}>
                    <FormInput
                      type={type}
                      value={value}
                      handleOnChange={value => this.handleFieldChange(row, 'values', {type, value}, idx)}
                    />
                  </div>
                );
              })
            )}
          </div>
        </Dialog>
      );
    } else {
      // Dialog props
      const
        options = Object.keys(operators)
          .map(op => {
            const {id: name, name: label} = operators[op].props;
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
                    handleOnChange={value => this.handleFieldChange(row, 'values', {type, value}, idx)}
                  />
                </div>
              );
            })}
          </div>
        </Dialog>
      );
    }
  }

  _saveDataDialog(action) {
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
            className="col-md-4 bold uppercase pull-left"
            value="Conditions: "
          />
          {/* <h5>{expression}</h5>*/}
          {readonly
            ? null
            : <Button
            className="btn-default pull-right"
            onClick={e => this._addCondition(e)}
          ><span className="fa fa-plus"></span>{' Add'}</Button>
          }
        </div>
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