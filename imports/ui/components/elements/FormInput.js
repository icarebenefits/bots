import React, {Component} from 'react';

import {Checkbox} from './Checkbox';
import {Textbox} from './Textbox';
import {Selectbox} from './Selectbox';
import {DatePicker} from './DatePicker';


export class FormInput extends Component {

  getValue() {
    return this.refs.input.getValue();
  }

  render() {
    const
      {id, type, defaultValue, value, className, multiline, options, handleOnChange, hidden} = this.props,
      common = {id, ref: 'input', className, defaultValue, multiline, value, handleOnChange, hidden, type}
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
          <Textbox {...common} />
        );
      }
    }
  }
}

export default FormInput