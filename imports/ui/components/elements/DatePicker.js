import React, {Component} from 'react';
import moment from 'moment';
import _ from 'lodash';

export class DatePicker extends Component {

  constructor() {
    super();

    this.state = {
      value: null
    };
  }

  el = null;
  isForce = false;

  getValue() {
    return this.state.value;
  }

  componentDidMount() {
    if (!this.props.disabled) {
      this.initDatePicker();
    }
  }

  componentWillReceiveProps(nextProps) {
    console.log('oldProps', this.props);
    console.log('newProps', nextProps);
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
      console.log('datepicker', e.target.value);
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
    const {isDateObject, handleOnChange = () => null} = this.props;
    let value = new Date();
    if (isDateObject) {
      value = moment(val, 'MM/DD/YYYY').toDate();
    } else {
      value = val;
    }
    handleOnChange(value);
    this.setState({value});
  }

  render() {
    const {label = '', labelClass = "font-normal", value = '', isDateObject = false, disabled, className = 'form-group'} = this.props;
    const dateObj = moment(value);
    return (
      <div className={className}>
        <div className="input-group date" ref={'component'}>
          <input
            type="text"
            className="form-control"
            disabled={disabled}
            defaultValue={isDateObject ? dateObj.format('MM/DD/YYYY') : value}
          />
          {label && (
            <label className={labelClass}>{label}</label>
          )}
          <span className="input-group-addon">
						<i className="glyphicon glyphicon-calendar"/>
					</span>
        </div>
      </div>
    );
  }
}

export default DatePicker