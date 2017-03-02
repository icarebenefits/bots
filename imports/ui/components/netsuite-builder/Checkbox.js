import React, {Component} from 'react';

export class Checkbox extends Component {
  render() {
    const {name, value, handleOnChange} = this.props;
    return (
      <input 
        type="checkbox"
        value={value}
        onChange={e => handleOnChange(e.target.checked)}
      />
    );
  }
}