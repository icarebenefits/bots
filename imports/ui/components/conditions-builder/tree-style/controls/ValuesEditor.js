import React, {Component, PropTypes} from 'react';
import moment from 'moment';

// components
import {DatePicker} from '../../../elements/DatePicker';

class ValuesEditor extends Component {

  render() {
    const
      {type, value, handleOnChange} = this.props,
      isDate = moment.isDate(value)
      ;

    if (type === 'date') {
      return (
        <DatePicker
          label=""
          option={{ startView: 2, todayBtn: "linked", keyboardNavigation: false, forceParse: false, autoclose: true }}
          isDateObject={true}
          value={isDate ? value : new Date()}
          disabled={false}
          onChange={date => handleOnChange(date)}
        />
      );
    } else {
      return (
        <input
          type="text"
          value={isDate ? "" : value}
          onChange={e => handleOnChange(e.target.value)}
        />
      );
    }
  }
}

ValuesEditor.propTypes = {
  value: PropTypes.string,
  handleOnChange: PropTypes.func,
};

export default ValuesEditor