// @flow
import React, {Component, PropTypes} from 'react';

// components
import Suggest from './Suggest';
import Select from './Select';
import DatePicker from './DatePicker';

class FormInput extends Component {

  getValue() {
    // console.log(this.refs.input.value);

    return 'value' in this.refs.input
      ? this.refs.input.type === 'checkbox' ? this.refs.input.checked : this.refs.input.value
      : this.refs.input.getValue()
      ;
  }

  render() {
    const
      {id, type = 'input', defaultValue, options} = this.props,
      commonProps = {
        id,
        defaultValue,
        ref: 'input',
        className: "form-control"
      }
      ;

    switch (type) {
      case 'suggest': {
        return (
          <Suggest
            {...commonProps}
            options={options}
          />
        );
      }
      case 'select': {
        return (
          <Select
            {...commonProps}
            options={options}
          />
        );
      }
      case 'date': {
        return (
          <DatePicker
            {...commonProps}
            label=""
            option={{ startView: 2, todayBtn: "linked", keyboardNavigation: false, forceParse: false, autoclose: true }}
            isDateObject={true}
            value={new Date()}
            disabled={false}
            onChange={date => console.log(date)}
          />
        );
      }
      case 'checkbox': {
        return (
          <input {...commonProps} type="checkbox"/>
        );
      }
      case 'text': {
        return (
          <textarea {...commonProps} />
        );
      }
      default: {
        return (
          <input {...commonProps} type={type} />
        );
      }
    }
  }
}

FormInput.propTypes = {
  type: PropTypes.oneOf(['text', 'suggest', 'input', 'select', 'checkbox', 'date']),
  id: PropTypes.string,
  defaultValue: PropTypes.any,
  options: PropTypes.arrayOf(
    PropTypes.string
  )
};

export default FormInput