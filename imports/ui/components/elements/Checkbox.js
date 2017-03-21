import React, {Component} from 'react';
import classNames from 'classnames';

export class Checkbox extends Component {

  getValue() {
    return this.refs.checkbox.checked;
  }

  render() {
    const {name, className, value, handleOnChange} = this.props;
    return (
      <input 
        type="checkbox"
        ref="checkbox"
        className={classNames('', className)}
        checked={value}
        onChange={e => handleOnChange(e.target.checked)}
      />
    );
  }
}

export default Checkbox