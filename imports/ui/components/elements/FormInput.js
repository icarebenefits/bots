import React, {Component} from 'react';

import {Checkbox} from './Checkbox';
import {Textbox} from './Textbox';
import {Selectbox} from './Selectbox';
import {DatePicker} from './DatePicker';
import Suggest from './Suggest';


export class FormInput extends Component {

  getValue() {
    return this.refs.input.getValue();
  }

  render() {
    const
      {
        id, type, defaultValue, value, className, placeholder = '', suggests = [],
        multiline, options, handleOnChange, hidden, index
      } = this.props,
      common = {
        id, ref: 'input', className, defaultValue, placeholder,
        multiline, value, handleOnChange, hidden, type
      }
      ;

    switch (type) {
      case 'select':
      {
        return (
          <Selectbox
            {...common}
            options={options}
          />
        );
      }
      case 'checkbox':
      {
        return (
          <Checkbox
            {...common}
          />
        );
      }
      case 'date':
      {
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
      case 'bool':
      {
        const options = [
          {name: '', label: ''},
          {name: 'true', label: 'true'},
          {name: 'false', label: 'false'},
        ];
        return (
          <Selectbox
            {...common}
            options={options}
          />
        );
      }
      case 'gender':
      {
        const options = [
          {name: '', label: ''},
          {name: 'male', label: 'male'},
          {name: 'female', label: 'female'},
          {name: 'not specified', label: 'not specified'},
        ];
        return (
          <Selectbox
            {...common}
            options={options}
          />
        );
      }
      case 'inLast':
      {
        let options = [];
        if (index > 0) {
          options = [
            {name: '', label: ''},
            {name: 'years', label: 'years'},
            {name: 'months', label: 'months'},
            {name: 'weeks', label: 'weeks'},
            {name: 'days', label: 'days'},
            {name: 'hours', label: 'hours'},
            {name: 'minutes', label: 'minutes'},
            {name: 'seconds', label: 'seconds'},
          ];
        } else {
          options = [
            {name: '', label: ''},
            {name: '1', label: '1'}, {name: '2', label: '2'}, {name: '3', label: '3'},
            {name: '4', label: '4'}, {name: '5', label: '5'}, {name: '6', label: '6'},
            {name: '7', label: '7'}, {name: '8', label: '8'}, {name: '9', label: '9'},
            {name: '10', label: '10'}, {name: '11', label: '11'}, {name: '12', label: '12'},
            {name: '13', label: '13'}, {name: '14', label: '14'}, {name: '15', label: '15'},
            {name: '16', label: '16'}, {name: '17', label: '17'}, {name: '18', label: '18'},
            {name: '19', label: '19'}, {name: '20', label: '20'}, {name: '21', label: '21'},
            {name: '22', label: '22'}, {name: '23', label: '23'}, {name: '24', label: '24'},
          ];
        }
        return (
          <Selectbox
            {...common}
            options={options}
          />
        );
      }
      case 'suggest':
      {
        return <Suggest
          {...common}
          options={suggests}
        />;
      }
      default:
      {
        return (
          <Textbox {...common} />
        );
      }
    }
  }
}

FormInput.propTypes = {};

export default FormInput