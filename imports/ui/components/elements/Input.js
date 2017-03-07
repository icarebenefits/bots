import React, {Component} from 'react';

export class Input extends Component {
  render() {
    const {name, className, value, handleOnChange} = this.props;
    return (
      <input
        type="text"
        className={className}
        defaultValue={value}
        onChange={e => handleOnChange(e.target.value)}
      />
    );
  }
}