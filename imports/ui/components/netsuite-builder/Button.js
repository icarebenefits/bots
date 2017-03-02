import React, {Component} from 'react';
import classNames from 'classnames';

export class Button extends Component {
  render() {
    const {name, label, type = 'button', className = 'btn-default', handleOnClick} = this.props;
    return (
      <button
        type={type}
        className={classNames('btn', className)}
        onClick={e => handleOnClick(name)}
      >
        {label}
      </button>
    );
  }
}