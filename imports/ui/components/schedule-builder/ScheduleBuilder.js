import React, {Component, PropTypes} from 'react';
import {later} from 'meteor/mrt:later';

// import Schema from './schema';
import {
  FormInput,
  Label,
  Button,
} from '../elements';

class ScheduleBuilder extends Component {

  constructor(props) {
    super(props);

    console.log('builder', props.frequency);
    this.state = {
      preps: !_.isEmpty(props.frequency) ? props.frequency.first.preps : 'on the',
      preps2: !_.isEmpty(props.frequency) ? props.frequency.second.preps : 'on',
      first: !_.isEmpty(props.frequency) ? props.frequency.first : {},
      second: !_.isEmpty(props.frequency) ? props.frequency.second : {},
    };

    this.getScheduleText = this.getScheduleText.bind(this);
    this.getData = this.getData.bind(this);
    this._validateSchedule = this._validateSchedule.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      preps: !_.isEmpty(nextProps.frequency) ? nextProps.frequency.first.preps : 'on the',
      preps2: !_.isEmpty(nextProps.frequency) ? nextProps.frequency.second.preps : 'on',
      first: !_.isEmpty(nextProps.frequency) ? nextProps.frequency.first : {},
      second: !_.isEmpty(nextProps.frequency) ? nextProps.frequency.second : {},
    });
  }

  laterParse(text) {
    const {error} = later.parse.text(text);
    if (error)
      return result;
  }

  getScheduleText() {
    const
      {
        first: {preps, range, unit},
        second: {preps: preps2, range: range2},
      } = this.state
      ;
    let text = '';

    !_.isEmpty(preps) && (text = `${preps}`);
    !_.isEmpty(range) && (text = `${text} ${range}`);
    !_.isEmpty(unit) && (preps === 'at') ? (text = `${text}:${unit}`) : (text = `${text} ${unit}`);
    !_.isEmpty(preps2) && (text = `${text} ${preps2}`);
    !_.isEmpty(range2) && (text = `${text} ${range2}`);

    return text;
  }

  getData() {
    const {first, second} = this.state;
    return {first, second};
  }

  _validateSchedule(e) {
    e.preventDefault();
    const text = this.getScheduleText();
    console.log(text);
    const {error} = later.parse.text(text);
    if(error === -1) alert('Good to go');
    else alert('Schedule is invalid.');
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
            {name: '', label: ''},
            {name: 'seconds', label: 'seconds'}, {name: 'minutes', label: 'minutes'}, {name: 'hours', label: 'hours'},
            {name: 'days', label: 'days'}, {name: 'weeks', label: 'weeks'}, {name: 'months', label: 'months'},
          ],
        }
      },
      secondPart = {
        prepsOpts: [
          {name: '', label: ''},
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

    const {label} = this.props;
    const {preps, preps2, first, second} = this.state;

    return (
      <div>
        <Label
          className="col-md-12 bold uppercase pull-left"
          value={label || 'Schedule Builder'}
        />
        {/* First part */}
        <div className="row">
          <div className="col-md-2">
            <FormInput
              ref="preps"
              type="select"
              className="form-control"
              value={first.preps}
              options={firstPart.prepsOpts}
              handleOnChange={value => this.setState({first: {...first, preps: value}, preps: value})}
            />
          </div>
          <div className="col-md-2">
            <FormInput
              ref="range"
              type="select"
              className="form-control"
              value={first.range}
              options={firstPart.rangeOpts[preps]}
              handleOnChange={value => this.setState({first: {...first, range: value}})}
            />
          </div>
          <Label
            className="control-label pull-left"
            value={preps === 'at' ? ' : ' : ''}
          />
          <div className="col-md-2">
            <FormInput
              ref="unit"
              type="select"
              className="form-control"
              value={first.unit}
              options={firstPart.unitOpts[preps]}
              handleOnChange={value => this.setState({first: {...first, unit: value}})}
            />
          </div>
          {/* Second part */}
          {preps !== 'on the' && (
            <div className="col-md-2">
              <FormInput
                type="select"
                className="form-control"
                value={second.preps || ''}
                options={secondPart.prepsOpts}
                handleOnChange={value => this.setState({second: {preps: value, second: ''}, preps2: value})}
              />
            </div>
          )}
          {(preps !== 'on the' && !_.isEmpty(preps2)) && (
            <div className="col-md-2">
              <FormInput
                type="select"
                className="form-control"
                value={second.range || ''}
                options={secondPart.rangeOpts[preps2]}
                handleOnChange={value => this.setState({second: {...second, range: value}})}
              />
            </div>
          )}
          <div className="col-md-1">
            <Button
              className="green"
              onClick={e => this._validateSchedule(e)}
            >Validate</Button>
          </div>
        </div>
      </div>
    );
  }
}

export default ScheduleBuilder