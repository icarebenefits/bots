import React, {Component} from 'react';
import moment from 'moment';

class DatePicker extends Component {

  el = null;
  isForce = false;

  componentDidMount() {
    if (!this.props.disabled) {
      this.initDatePicker();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.disabled != nextProps.disabled) {
      if (nextProps.disabled) {
        $(this.refs.component).find(".input-group-addon").off();
      } else {
        this.initDatePicker();
      }
    }
    let oldValue = this.props.value;
    let value = nextProps.value;
    if (nextProps.isDateObject) {
      oldValue = oldValue.getTime();
      value = value.getTime();
    }
    if (oldValue != value) {
      this.isForce = true;
      $(this.refs.component).datepicker('update', nextProps.value);
    }
  }

  initDatePicker() {
    this.el = $(this.refs.component);
    const option = this.props.option || {};
    this.el.datepicker(option).on('input change', _.debounce(e => {
      if (this.isForce) {
        this.isForce = false;
      } else {
        this._onChange(e.target.value);
      }
    }, 200));
  }

  /**
   * @event
   * on date change
   */
  _onChange = val => {
    const {isDateObject, onChange = () => null} = this.props;
    if (isDateObject) {
      onChange(moment(val, 'MM/DD/YYYY').toDate());
    } else {
      onChange(val);
    }
  }

  render() {
    const {label = '', value = '', error, isDateObject = false, disabled} = this.props;
    const dateObj = moment(value);
    return (
      <div className={'form-group'}>
        {label && (
          <label className="font-noraml">
            { label }
          </label>
        )}
        <div className="input-group date" ref={'component'}>
					<span className="input-group-addon">
						<i className="glyphicon glyphicon-calendar"/>
					</span>
          <input
            type="text"
            className="form-control"
            disabled={disabled}
            defaultValue={isDateObject ? dateObj.format('MM/DD/YYYY') : value}
          />
        </div>
      </div>
    );
  }
}

export default DatePicker