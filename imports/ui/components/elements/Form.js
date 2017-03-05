import React, {Component} from 'react';
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
        {fields.map(field => {
          const {id, label, type, hidden, options, handleOnChange} = field;
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
              <FormInput {...field} value={value} ref={id} />
            </div>
          );
        })}
      </form>
    );
  }
}