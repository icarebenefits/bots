import React, {Component} from 'react';

export class Textbox extends Component {
  
  getValue() {
    return this.refs.input.value;
  }
  
  render() {
    const {multiline = false, className, value, type, handleOnChange, placeholder, height = 50} = this.props;
    if(multiline) {
      return (
        <textarea
          type="text"
          ref="input"
          className={className}
          defaultValue={value}
          placeholder={placeholder}
          height={height}
          onChange={e => handleOnChange(e.target.value)}
        />
      );
    }
    return (
      <input
        type={type || 'text'}
        ref="input"
        className={className}
        defaultValue={value}
        placeholder={placeholder}
        onChange={e => handleOnChange(e.target.value)}
      />
    );
  }
}

export default Textbox