import React, {Component} from 'react';

export class Textbox extends Component {
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

export default Textbox