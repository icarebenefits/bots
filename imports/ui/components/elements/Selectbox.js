import React, {Component} from 'react';
import classNames from 'classnames';

export class Selectbox extends Component {

  getValue() {
    return this.refs.select.value;
  }

  render() {
    const {value, defaultValue, className, handleOnChange, options} = this.props;
    
    return (
      <select
        ref="select"
        value={value}
        defaultValue={defaultValue}
        className={classNames('select2', className)}
        onChange={e => handleOnChange(e.target.value)}
      >
        {options.map(option => {
          const {name, label} = option;
          return (
            <option key={name} value={name} onClick={() => {}}>{label}</option>
          );
        })}
      </select>
    );
  }
}

Selectbox.propTypes = {
  
};

export default Selectbox