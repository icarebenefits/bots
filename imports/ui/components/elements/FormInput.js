import React, {Component} from 'react';

import {Checkbox} from './Checkbox';
import {Input} from './Input';
import {Selectbox} from './Selectbox';
import {DatePicker} from './DatePicker';


export class FormInput extends Component {
  render() {
    const
      {id, type, value, className, options, handleOnChange} = this.props,
      common = {id, ref: 'input', className, value, handleOnChange}
      ;

    switch (type) {
      case 'select': {
        return (
          <Selectbox
            {...common}
            options={options}
          />
        );
      }
      case 'checkbox': {
        return (
          <Checkbox
            {...common}
          />
        );
      }
      case 'date': {
        return (
          <DatePicker
            {...common}
            label=""
            option={{ startView: 2, todayBtn: "linked", keyboardNavigation: false, forceParse: false, autoclose: true }}
            isDateObject={true}
            value={new Date(value)}
            disabled={false}
            onChange={date => handleOnChange(id, date)}
          />
        );
      }
      default: {
        return (
          <Input {...common} />
        );
      }
    }
  }
}