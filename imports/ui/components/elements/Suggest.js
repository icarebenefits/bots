// @flow
import React, {Component, PropTypes} from 'react';

class Suggest extends Component {
  getValue() {
    return this.refs.lowLevelInput.value;
  }
  
  render() {
    const 
      {options, value, placeHolder, className, handleOnChange} = this.props,
      randomId = Math.random().toString(16).substring(2)
    ;
    
    return (
      <div>
        <input 
          list={randomId}
          value={value}
          placeholder={placeHolder}
          ref="lowLevelInput"
          className={className}
          onChange={e => handleOnChange(e.target.value)}
        />
        <datalist
          id={randomId}
        >
          {options.map(item => (
            <option value={item.name} key={item.name}>{item.label}</option>
          ))}
        </datalist>
      </div>
    );
  }
}

Suggest.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      label: PropTypes.string,
    })
  ),
  defaultValue: PropTypes.string,
};

export default Suggest