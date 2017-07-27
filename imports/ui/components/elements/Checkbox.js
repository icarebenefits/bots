import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export class Checkbox extends Component {

  getValue() {
    return this.refs.checkbox.checked;
  }

  render() {
    const {className, value, handleOnChange} = this.props;
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

Checkbox.propTypes = {
  className: PropTypes.string,
  value: PropTypes.bool,
  handleOnChange: PropTypes.func
};

export default Checkbox