import React, {Component, PropTypes} from 'react';

class Clock extends Component {
  constructor(props) {
    super(props);

    const currentTime = new Date();
    this.state = this._getTime();

    this._updateClock = this._updateClock.bind(this);
  }

  componentDidMount() {
    this._setTimer();
  }

  componentWillUnmout() {
    if(this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  _getTime() {
    const currentTime = new Date();
    return {
      hours: currentTime.getHours(),
      minutes: currentTime.getMinutes(),
      seconds: currentTime.getSeconds(),
      ampm: currentTime.getHours() >= 12 ? 'PM' : 'AM'
    };
  }

  _setTimer() {
    setTimeout(this._updateClock, 1000);
  }

  _updateClock() {
    this.setState(this._getTime, this._setTimer);
  }

  render() {
    const {hours, minutes, seconds, ampm} = this.state;

    return (
      <div className="clock">
        {
          hours === 0
            ? 12
            : (hours > 12) ? (hours - 12) : hours
        }
        :
        {
          minutes > 9 ? minutes : `0${minutes}`
        }
        :
        {
          seconds > 9 ? seconds : `0${seconds}`
        }
        {` ${ampm}`}
      </div>
    );
  }
}

Clock.propTypes = {

};

export default Clock