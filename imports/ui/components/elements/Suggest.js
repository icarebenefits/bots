// @flow
import React, {Component, PropTypes} from 'react';

class Suggest extends Component {
  getValue() {
    console.log('suggest', this.refs.lowLevelInput.value);
    return this.refs.lowLevelInput.value;
  }
  
  render() {
    const 
      {options, value, placeHolder, className, handleOnChange, label} = this.props,
      randomId = Math.random().toString(16).substring(2)
    ;
    
    return (
      <div className={className}>
        <input 
          list={randomId}
          value={value}
          placeholder={placeHolder}
          ref="lowLevelInput"
          className="form-control"
          onChange={e => {if(handleOnChange) handleOnChange(e.target.value);}}
        />
        <datalist
          id={randomId}
        >
          {options.map(item => (
            <option value={item.name} key={item.name}>{item.label}</option>
          ))}
        </datalist>
        {label && (
          <label>{label}</label>
        )}
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