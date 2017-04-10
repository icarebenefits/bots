import React, {Component, PropTypes} from 'react';
import _ from 'lodash';

import {
  FormInput,
} from '../elements';

class FormDialog extends Component {
  render() {
    const
      {row, condition, fields, operators, values, handleOnChange} = this.props,
      {operator, field} = condition
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
      if (!_.isEmpty(field)) {
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
        <div className="form-body">
          <div className="form-group">
            <FormInput
              ref="field"
              type="select"
              value={field}
              options={options}
              handleOnChange={value => handleOnChange(row, 'field', value)}
            />
          </div>
          {!_.isEmpty(opOptions) && (
            <div className="form-group">
              <FormInput
                ref="operator"
                type="select"
                value={operator}
                options={opOptions}
                handleOnChange={value => handleOnChange(row, 'operator', value)}
              />
            </div>
          )}
          {!_.isEmpty(opOptions) && (
            values.map((input, idx) => {
              const {type, value} = input;
              return (
                <div className="form-group" key={idx}>
                  <FormInput
                    index={idx}
                    type={type}
                    value={value}
                    handleOnChange={value => handleOnChange(row, 'values', {type, value}, idx)}
                  />
                </div>
              );
            })
          )}
        </div>
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
        <div className="form-body">
          <div className="form-group">
            <FormInput
              ref="operator"
              type="select"
              value={operator}
              options={options}
              handleOnChange={value => handleOnChange(row, 'operator', value)}
            />
          </div>
          {values.map((input, idx) => {
            const {type, value} = input;
            return (
              <div className="form-group" key={idx}>
                <FormInput
                  index={idx}
                  type={type}
                  value={value}
                  handleOnChange={value => handleOnChange(row, 'values', {type, value}, idx)}
                />
              </div>
            );
          })}
        </div>
      );
    }
  }
}

FormDialog.propTypes = {
  row: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  condition: PropTypes.shape({
    not: PropTypes.bool,
    openParens: PropTypes.string,
    group: PropTypes.string,
    filter: PropTypes.string,
    field: PropTypes.string,
    operator: PropTypes.string,
    values: PropTypes.array,
    closeParens: PropTypes.string,
    bitwise: PropTypes.string,
  }),
  fields: PropTypes.object,
  operators: PropTypes.object,
  values: PropTypes.array,
  handleOnChange: PropTypes.func,
};

export default FormDialog
