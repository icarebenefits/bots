import React, {Component} from 'react';
import classNames from 'classnames';

export class Selectbox extends Component {

  getValue() {
    return this.refs.select.value;
  }

  render() {
    const {value, className, handleOnChange, options} = this.props;
    return (
      <select
        value={value}
        ref="select"
        className={classNames('select2', className)}
        onChange={e => handleOnChange(e.target.value)}
      >
        {options.map(option => {
          const {name, label} = option;
          return (
            <option key={name} value={name} onClick={e => console.log(e.target.value)}>{label}</option>
          );
        })}
      </select>
    );
  }
}

Selectbox.propTypes = {
  
};

export default Selectbox