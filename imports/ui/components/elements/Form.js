import React, {Component, PropTypes} from 'react';
import _ from 'lodash';

import {FormInput} from './FormInput';

export class Form extends Component {
  render() {
    const
      {
        fields,
        className = "",
        onSubmit = e => e.preventDefault()
      } = this.props;

    return (
      <form
        className={className}
        onSubmit={onSubmit}
      >
        <div className="form-body">
          {fields.map(field => {
            const {id, label, type, className, hidden, options, handleOnChange} = field;
            let value = field.value;

            if(type === 'date') {
              if(!_.isEmpty(value)) {
                value = new Date(value);
              } else {
                value = new Date();
              }
            }

            if(hidden) {
              return null;
            }
            return (
              <div className="form-group" key={id}>
                <label htmlFor={id}>{label}</label>
                <div className="input-group">
                  <FormInput {...field} value={value} ref={id} />
                </div>
              </div>
            );
          })}
        </div>
      </form>
    );
  }
}

Form.propTypes = {
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      label: PropTypes.string,
      type: PropTypes.string,
      value: PropTypes.any,
      handleOnChange: PropTypes.func,
      hidden: PropTypes.bool,
    })
  )
};

export default Form