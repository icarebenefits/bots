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
    const {label = '', value = '', isDateObject = false, disabled} = this.props;
    const dateObj = moment(value);
    return (
      <div className={'form-group'}>
        {label && (
          <label className="font-normal">
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