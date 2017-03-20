import React, {Component} from 'react';

export class Textbox extends Component {
  
  getValue() {
    return this.refs.input.value;
  }
  
  render() {
    const {name, multiline = false, className, value, handleOnChange} = this.props;
    if(multiline) {
      return (
        <textarea
          type="text"
          ref="input"
          className={className}
          defaultValue={value}
          height="50"
          onChange={e => handleOnChange(e.target.value)}
        />
      );
    }
    return (
      <input
        type="text"
        ref="input"
        className={className}
        defaultValue={value}
        onChange={e => handleOnChange(e.target.value)}
      />
    );
  }
}

export default Textbox