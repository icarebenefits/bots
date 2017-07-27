import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export class SelectboxGrouped extends Component {

  getValue() {
    return this.refs.select.value;
  }

  _getGroupId(e) {
    const index = e.selectedIndex;
    return e.options[index].parentNode.id;
  }

  render() {
    const {value, defaultValue, className, handleOnChange, grpOptions} = this.props;

    return (
      <select
        ref="select"
        value={value}
        defaultValue={defaultValue}
        className={classNames('select2', className)}
        onChange={e => handleOnChange({value: e.target.value, groupId: this._getGroupId(this.refs.select)})}
      >
        {grpOptions.map(group => {
          const {name, label, options} = group;
          return (
            <optgroup label={label} key={name} ref="optgroup" id={name}>
              {options.map(option => {
                const {name, label} = option;
                return (
                  <option key={name} value={name} onClick={() => console.log()}>{label}</option>
                );
              })}
            </optgroup>
          );
        })}
      </select>
    );
  }
}

SelectboxGrouped.propTypes = {
  value: PropTypes.string,
  defaultValue: PropTypes.string,
  className: PropTypes.string,
  handleOnChange: PropTypes.func,
  groupOptions: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string,
        options: PropTypes.arrayOf(
          PropTypes.shape({
            name: PropTypes.string,
            label: PropTypes.string,
          })
        )
      })
  )
};

export default SelectboxGrouped