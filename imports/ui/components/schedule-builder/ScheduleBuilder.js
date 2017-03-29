import React, {Component, PropTypes} from 'react';
import {later} from 'meteor/mrt:later';
import momentTZ from 'moment-timezone';

import {
  FormInput,
  Label,
  Button,
} from '../elements';
import Clock from '../Clock';
import * as Notify from '/imports/api/notifications';

class ScheduleBuilder extends Component {

  constructor(props) {
    super(props);

    const {preps = '', range = '', unit = '', preps2 = '', range2 = ''} = props.frequency;

    this.state = {
      preps,
      range,
      unit,
      preps2,
      range2,
    };

    // handlers
    this._handleFieldChange = this._handleFieldChange.bind(this);
    this._validateSchedule = this._validateSchedule.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const {frequency} = nextProps;
  }

  getData() {
    return this.state;
  }

  _defaultState() {
    return {
      preps: '',
      range: '',
      unit: '',
      preps2: '',
      range2: '',
    };
  }

  _getScheduleText() {
    const {preps, range, unit, preps2, range2} = this.state;
    let text = '';

    !_.isEmpty(preps) && (text = `${preps}`);
    !_.isEmpty(range) && (text = `${text} ${range}`);
    !_.isEmpty(unit) && (preps === 'at') ? (text = `${text}:${unit}`) : (text = `${text} ${unit}`);
    !_.isEmpty(preps2) && (text = `${text} ${preps2}`);
    !_.isEmpty(range2) && (text = `${text} ${range2}`);

    return text;
  }

  _validateSchedule(e) {
    e.preventDefault();
    const
      text = this._getScheduleText(),
      {error} = later.parse.text(text);
    if (error === -1) {
      Notify.success({title: 'Schedule builder', message: `Schedule good: ${text}`});
    }
    else {
      Notify.warning({title: 'Schedule builder', message: 'Schedule invalid.'});
    }
  }

  _handleFieldChange(field, value) {
    switch (field) {
      case 'preps':
      {
        return this.setState({
          ...this._defaultState(),
          preps: value
        });
      }
      case 'range':
      {
        const {preps} = this.state;
        return this.setState({
          range: value
        });
      }
      case 'unit':
      {
        return this.setState({
          unit: value,
        });
      }
      case 'preps2':
      {
        return this.setState({
          preps2: value,
          range2: '',
        });
      }
      case 'range2':
      {
        return this.setState({
          range2: value,
        });
      }
    }
  }

  render() {
    const
      firstPart = {
        prepsOpts: [
          {name: '', label: ''},
          {name: 'on the', label: 'on the'},
          {name: 'at', label: 'at'},
          {name: 'every', label: 'every'},
        ],
        rangeOpts: {
          'on the': [
            {name: '', label: ''},
            {name: 'first', label: 'first'},
            {name: 'last', label: 'last'},
          ],
          at: [
            {name: '', label: ''},
            {name: '1', label: '1'}, {name: '2', label: '2'}, {name: '3', label: '3'},
            {name: '4', label: '4'}, {name: '5', label: '5'}, {name: '6', label: '6'},
            {name: '7', label: '7'}, {name: '8', label: '8'}, {name: '9', label: '9'},
            {name: '10', label: '10'}, {name: '11', label: '11'}, {name: '12', label: '12'},
            {name: '13', label: '13'}, {name: '14', label: '14'}, {name: '15', label: '15'},
            {name: '16', label: '16'}, {name: '17', label: '17'}, {name: '18', label: '18'},
            {name: '19', label: '19'}, {name: '20', label: '20'}, {name: '21', label: '21'},
            {name: '22', label: '22'}, {name: '23', label: '23'}, {name: '24', label: '24'},
          ],
          every: [
            {name: '', label: ''},
            {name: '1', label: '1'}, {name: '2', label: '2'}, {name: '3', label: '3'},
            {name: '4', label: '4'}, {name: '6', label: '6'}, {name: '8', label: '8'},
            {name: '12', label: '12'},
          ],
        },
        unitOpts: {
          'on the': [
            {name: '', label: ''},
            {name: 'day of the week', label: 'day of the week'},
            {name: 'day of the month', label: 'day of the month'},
            {name: 'week of the month', label: 'week of the month'},
            {name: 'week of the year', label: 'week of the year'},
          ],
          at: [
            {name: '', label: ''},
            {name: '00', label: '00'}, {name: '10', label: '10'}, {name: '20', label: '20'},
            {name: '30', label: '30'}, {name: '40', label: '40'}, {name: '50', label: '50'},
          ],
          every: [
            {name: '', label: ''}, {name: 'minutes', label: 'minutes'}, {name: 'hours', label: 'hours'},
            {name: 'days', label: 'days'}, {name: 'weeks', label: 'weeks'}, {name: 'months', label: 'months'},
          ],
        }
      },
      secondPart = {
        prepsOpts: [
          {name: '', label: 'daily'},
          {name: 'on', label: 'on'},
          {name: 'every', label: 'on every'},
        ],
        rangeOpts: {
          on: [
            {name: '', label: ''},
            {name: 'monday', label: 'monday'},
            {name: 'tuesday', label: 'tuesday'},
            {name: 'wednesday', label: 'wednesday'},
            {name: 'thursday', label: 'thursday'},
            {name: 'friday', label: 'friday'},
            {name: 'saturday', label: 'saturday'},
            {name: 'sunday', label: 'sunday'},
          ],
          every: [
            {name: '', label: ''},
            {name: 'weekday', label: 'weekday'},
            {name: 'weekend', label: 'weekend'},
          ]
        },
      }
      ;

    const {preps, range, unit, preps2, range2} = this.state;
    const {hasValidate} = this.props;
    const userTZ = `GMT ${momentTZ().tz(momentTZ.tz.guess()).format('Z')}`;

    console.log('timezone', momentTZ.tz.guess())

    return (
      <div className="col-md-12">
        <div className="row">
          <Label
            className="col-md-12 bold uppercase pull-left"
            value={'Schedule Builder'}
          />
        </div>
        {/* Note */}
        <div className="row">
          <div className="col-md-12">
            <div className="note note-info">
              <h4 className="block">All time for the schedule should be in GMT+0.</h4>
              <h5 className="block">{`You are in ${userTZ}. Your current time is: `} <Button
                className="green"><Clock /></Button></h5>
            </div>
          </div>
        </div>
        {/* Schedule */}
        <div className="row">
          <div className="col-md-2">
            <FormInput
              ref="preps"
              type="select"
              className="form-control"
              value={preps}
              options={firstPart.prepsOpts}
              handleOnChange={value => this._handleFieldChange('preps', value)}
            />
          </div>
          {!_.isEmpty(preps) && (
            <div className="col-md-2">
              <FormInput
                ref="range"
                type="select"
                className="form-control"
                value={range}
                options={firstPart.rangeOpts[preps]}
                handleOnChange={value => this._handleFieldChange('range', value)}
              />
            </div>
          )}
          {!_.isEmpty(preps) && (
            <Label
              className="control-label pull-left"
              value={preps === 'at' ? ' : ' : ''}
            />
          )}
          {!_.isEmpty(preps) && (
            <div className="col-md-2">
              <FormInput
                ref="unit"
                type="select"
                className="form-control"
                value={unit}
                options={firstPart.unitOpts[preps]}
                handleOnChange={value => this._handleFieldChange('unit', value)}
              />
            </div>
          )}
          {/* Second part */}
          {(!_.isEmpty(preps) && preps !== 'on the') && (
            <div className="col-md-2">
              <FormInput
                type="select"
                className="form-control"
                value={preps2}
                options={secondPart.prepsOpts}
                handleOnChange={value => this._handleFieldChange('preps2', value)}
              />
            </div>
          )}
          {(!_.isEmpty(preps) && !_.isEmpty(preps2)) && (
            <div className="col-md-2">
              <FormInput
                type="select"
                className="form-control"
                value={range2}
                options={secondPart.rangeOpts[preps2]}
                handleOnChange={value => this._handleFieldChange('range2', value)}
              />
            </div>
          )}
          {hasValidate && (
            <div className="col-md-1">
              <Button
                className="green"
                onClick={e => this._validateSchedule(e)}
              >Validate</Button>
            </div>
          )}
        </div>

      </div>
    );
  }
}

ScheduleBuilder.propTypes = {
  frequency: PropTypes.shape({
    preps: PropTypes.string,
    range: PropTypes.string,
    unit: PropTypes.string,
    preps2: PropTypes.string,
    range2: PropTypes.string,
  }).isRequired,
  hasValidate: PropTypes.bool, // has validate button or not
};

export default ScheduleBuilder