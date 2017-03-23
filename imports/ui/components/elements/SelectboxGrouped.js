import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';

export class SelectboxGrouped extends Component {

  getValue() {
    return this.refs.select.value;
  }

  render() {
    const {value, defaultValue, className, handleOnChange, grpOptions} = this.props;

    return (
      <select
        ref="select"
        value={value}
        defaultValue={defaultValue}
        className={classNames('select2', className)}
        onChange={e => handleOnChange({value: e.target.value, groupId: this.refs.optgroup.id})}
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