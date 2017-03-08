import React, {Component} from 'react';

export class Selectbox extends Component {
  render() {
    const {value, handleOnChange, options} = this.props;
    return (
      <select
        value={value}
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

export default Selectbox