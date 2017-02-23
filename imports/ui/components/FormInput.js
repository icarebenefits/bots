// @flow
import React, {Component, PropTypes} from 'react';

// components
import Suggest from './Suggest';

class FormInput extends Component {

  getValue() {
    return this.refs.input
  }

  render() {
    const
      {id, type, defaultValue, options} = this.props,
      commonProps = {
        id,
        defaultValue,
        ref: 'input'
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
  type: PropTypes.oneOf(['text', 'suggest', 'input']),
  id: PropTypes.string,
  defaultValue: PropTypes.any,
  options: PropTypes.arrayOf(
    PropTypes.string
  )
};

export default FormInput