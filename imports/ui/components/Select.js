import React, {Component, PropTypes} from 'react';

class Select extends Component {

  getValue() {
    return this.refs.lowLevelInput.value;
  }

  render() {
    const {defaultValue, options, className} = this.props;

    return (
      <select
        defaultValue={defaultValue}
        ref="lowLevelInput"
        className={className}
      >
        {options.map((item, idx) => {
          return <option value={item} key={idx} >{item}</option>
        })}
      </select>
    );
  }
}

Select.propTypes = {
  defaultValue: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.string
  ).isRequired
};

export default Select