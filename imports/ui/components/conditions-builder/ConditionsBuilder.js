import React, {Component} from 'react';
import _ from 'lodash';
import moment from 'moment';

// Fields
import {Field} from '/imports/api/fields';

import {Button, Dialog} from '../elements';
import {Condition} from './Condition';
import FormDialog from './FormDialog';
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

  /**
   * Get new conditions when props change
   *
   */
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
      {conditions, dialog: {groupId}} = this.state,
      condition = conditions[row];
    let cond = {};

    switch (key) {
      case 'filter':
      {
        const {groupId, value: val} = value;
        cond = {
          ...condition,
          group: groupId,
          filter: _.isEmpty(val) ? '' : val,
          field: '', operator: '', values: []
        };
        this.setState({
          dialog: {
            row,
            groupId,
            fieldId: val
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
      case 'edit': {
        const {group, filter, values} = condition;
        this.setState({
          dialog: {
            row,
            groupId: group,
            fieldId: filter
          },
          values
        });
        cond = {...condition};
        break;
      }
      case 'operator':
      {
        if (_.isEmpty(value)) {
          cond = {...condition, operator: '', values: []};
        } else {
          // key: operator, value: bool
          const
            Fields = Field()[groupId],
            {filter, field} = conditions[row],
            newValues = []
            ;

          
          let FieldData = {};
          if (!_.isEmpty(field)) {
            // field group
            console.log('field filter Fields', field, filter, Fields());
            FieldData = Object.assign({}, Fields().field()[filter]().field()[field]());
          } else {
            FieldData = Object.assign({}, Fields().field()[filter]())
          }

          const {type: opType, params} = FieldData.operator()[value].props();
          const {type: fieldType, placeholder, suggests} = FieldData.props();
          let type = opType;
          if(fieldType === 'suggest') {
            type = fieldType;
          }
          for (let i = 0; i < params - 1; i++) {
            newValues.push({type, value: this._getDefaultValue(type), placeholder, suggests});
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
        this.setState({values: newValues});
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
      case 'date': return (new Date()).toString();
      case 'number': return '';
      case 'suggests':
      case 'string': return '';
      case 'bool': return 'true';
      case 'gender': return 'not specified';
      default: return '';
    }
  }

  _getDefaultConditions() {
    return [{
      not: false,
      openParens: '',
      group: '',
      filter: '',
      field: '',
      operator: '',
      values: [],
      closeParens: '',
      bitwise: ''
    }];
  }

  _getDefaultCondition() {
    return {
      not: false,
      openParens: '',
      group: '',
      filter: '',
      field: '',
      operator: '',
      values: [],
      closeParens: '',
      bitwise: ''
    };
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

    if (!_.isEmpty(field)) {
      description = `${field} `;
    }
    if (operator) {
      // special case for operator: bool, gender
      if (['bool', 'gender'].indexOf(operator) === -1) {
        if(operator === 'inLast') {
          description = `${description} in last `;
        } else {
          description = `${description} ${operator} `;
        }
      }
      if (values.length > 1) {
        values.map(({type, value}, idx) => {
          let val = value;
          if (type === 'date') {
            val = moment(new Date(value)).format('LL');
          }
          if (idx === values.length - 1) {
            description = `${description} "${val}"`;
          } else {
            if(operator === 'inLast') {
              description = `${description} "${val}" `;
            } else {
              description = `${description} "${val}" and `;
            }
          }
        })
      } else {
        if (!_.isEmpty(values)) {
          const {type, value} = values[0];
          let val = value;
          if (type === 'date') {
            val = moment(new Date(value)).format('LL');
          }
          description = `${description} "${val}"`;
        }
      }
    }

    return description;
  }

  _renderDialog() {
    const {dialog} = this.state;

    if (_.isEmpty(dialog)) {
      return null;
    }

    const
      {dialog: {row, groupId, fieldId}, conditions, values} = this.state;

    if (_.isEmpty(fieldId)) {
      return null;
    }

    const
      FieldData = Field()[groupId]().field()[fieldId](),
      // operators = FieldData.operator(),
      // fields = FieldData.field(),
      {name: header} = FieldData.props();

    let operators = {}, fields = {};
    if(FieldData.operator) {
      operators = FieldData.operator();
    }
    if(FieldData.field) {
      fields = FieldData.field();
    }

    return (
      <Dialog
        modal={true}
        header={header}
        confirmLabel="Set"
        hasCancel={true}
        onAction={this._saveDataDialog}
      >
        <FormDialog 
          row={row}
          condition={conditions[row]}
          fields={fields}
          operators={operators}
          values={values}
          handleOnChange={this.handleFieldChange}
        />
      </Dialog>
    );
  }

  _saveDataDialog(action) {
    let newConds = [];
    if (action === 'dismiss') {
      newConds = this.props.conditions;
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
      {conditions, edit} = this.state
      ;
    let {handlers, readonly} = this.props;

    if (_.isEmpty(handlers)) {
      handlers = this.getDefaultHandlers();
    }

    return (
      <div className="col-md-12">
        <div className="row">
          <div className="col-md-12">
            <div className="note note-info">
              <h4 className="block uppercase">Conditions Builder</h4>
            </div>
            {readonly
              ? null
              : <Button
              className="btn-default pull-right"
              onClick={e => this._addCondition(e)}
            ><span className="fa fa-plus"></span>{' Add'}</Button>
            }
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <table className="table table-striped table-hover">
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
        </div>
        <div className="row">
          {this._renderDialog()}
        </div>
      </div>
    );
  }
}

export default ConditionsBuilder