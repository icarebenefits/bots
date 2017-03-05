import React, {Component} from 'react';

export class Input extends Component {
  render() {
    const {name, value, handleOnChange} = this.props;
    return (
      <input
        type="text"
        defaultValue={value}
        onChange={e => handleOnChange(e.target.value)}
      />
    );
  }
}