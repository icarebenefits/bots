import React, {Component, PropTypes} from 'react';
// import classNames from 'classnames';

// components
import {ValueSelector, ValuesEditor, ActionElement} from './controls';
// fields
import Fields from '/imports/api/fields/custom/fields';

class Condition extends Component {

  onFieldChanged = (value) => {
    this.onElementChanged('field', value);
  }

  onOperatorChanged = (value) => {
    this.onElementChanged('operator', value);
  }

  onValueChanged = (value) => {
    this.onElementChanged('value', value);
  }

  onElementChanged = (property, value) => {
    const {id, schema: {onPropChange}} = this.props;

    onPropChange(property, value, id);
  }

  removeRule = (event) => {
    event.preventDefault();
    event.stopPropagation();

    this.props.schema.onRuleRemove(this.props.id, this.props.parentId);
  }

  render() {
    const
      {
        id, parentId, field, operator, value,
        schema: {fields,
          controls: {fieldSelector, operatorSelector, valueEditor, removeRuleAction},
          getOperators, classNames}
      } = this.props,
      style = {
        marginRight: 5
      }
      ;

    const index = fields.findIndex(f => f.name === field);
    const type = fields[index].getType();


    return (
      <div className={`form-inline rule ${classNames.rule}`}>
        <div className="form-group" style={style}>
          <ValueSelector
            label="Field"
            options={fields}
            value={field}
            className={`rule-fields ${classNames.fields}`}
            handleOnChange={this.onFieldChanged}
          />
        </div>
        <div className="form-group" style={style}>
          <ValueSelector
            label="Operator"
            options={getOperators(field)}
            value={operator}
            className={`rule-operators ${classNames.operators}`}
            handleOnChange={this.onOperatorChanged}
          />
        </div>
        <div className="form-group" style={style}>
          <ValuesEditor
            field={field}
            type={type}
            operator={operator}
            value={value}
            className={`rule-value ${classNames.value}`}
            handleOnChange={this.onValueChanged}
          />
        </div>
        <div className="form-group" style={style}>
          <ActionElement
            icon="glyphicon glyphicon-remove"
            label=""
            className={`rule-remove ${classNames.removeRule}`}
            handleOnClick={this.removeRule}
          />
        </div>
      </div>
    );
  }
}

Condition.defaultProps = {
  id: null,
  parentId: null,
  field: null,
  operator: null,
  value: null,
  schema: null
};

export default Condition