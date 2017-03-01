// @flow
import React, {Component, PropTypes} from 'react';

// components
import Suggest from './Suggest';
import Select from './Select';

class FormInput extends Component {

  getValue() {
    return 'value' in this.refs.input
      ? this.refs.input.type === 'checkbox' ? this.refs.input.checked : this.refs.input.value
      : this.refs.input.getValue()
      ;
  }

  render() {
    const
      {id, type, defaultValue, options, ab} = this.props,
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
          <input {...commonProps} type="text"/>
        );
      }
    }
  }
}

FormInput.propTypes = {
  type: PropTypes.oneOf(['text', 'suggest', 'input', 'select', 'checkbox']),
  id: PropTypes.string,
  defaultValue: PropTypes.any,
  options: PropTypes.arrayOf(
    PropTypes.string
  )
};

export default FormInput