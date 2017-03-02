// @flow
import React, {Component, PropTypes} from 'react';

class Suggest extends Component {
  getValue() {
    return this.refs.lowLevelInput.value;
  }
  
  render() {
    const 
      {options, defaultValue, className} = this.props,
      randomId = Math.random().toString(16).substring(2)
    ;
    
    return (
      <div>
        <input 
          list={randomId}
          defaultValue={defaultValue}
          ref="lowLevelInput"
          className={className}
        />
        <datalist
          id={randomId}
        >
          {options.map((item, idx) => (
            <option value={item} key={idx} />
          ))}
        </datalist>
      </div>
    );
  }
}

Suggest.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.string
  ),
  defaultValue: PropTypes.string,
};

export default Suggest