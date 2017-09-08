import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {later} from 'meteor/mrt:later';
import momentTZ from 'moment-timezone';
import {Session} from 'meteor/session';
import _ from 'lodash';

import {
  FormInput,
  Label,
  Button,
} from '../elements';
import Note from '../Note';
import Clock from '../Clock';
import * as Notify from '/imports/api/notifications';
import {SCHEDULER_OPTIONS} from '/imports/ui/store/constants';

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

  // componentWillReceiveProps(nextProps) {
  //   const {frequency} = nextProps;
  // }

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
      case 'preps': {
        return this.setState({
          ...this._defaultState(),
          preps: value
        });
      }
      case 'range': {
        return this.setState({
          range: value
        });
      }
      case 'unit': {
        return this.setState({
          unit: value,
        });
      }
      case 'preps2': {
        return this.setState({
          preps2: value,
          range2: '',
        });
      }
      case 'range2': {
        return this.setState({
          range2: value,
        });
      }
    }
  }

  render() {
    const
      {firstPart, secondPart} = SCHEDULER_OPTIONS,
      {preps, range, unit, preps2, range2} = this.state,
      {hasValidate} = this.props,
      userTZ = `GMT ${momentTZ().tz(momentTZ.tz.guess()).format('Z')}`,
      isSuperAdmin = Session.get('isSuperAdmin');

    return (
      <div className="col-md-12">
        <div className="row">
          <div className="col-md-12">
            <div className="note note-info">
              <h4 className="block uppercase">Schedule Builder</h4>
            </div>
          </div>
        </div>
        {/* Note */}
        <div className="row">
          <div className="col-md-12">
            <Note
              title={`All time for the schedule should be in GMT+0.`}
              message={`You are in ${userTZ}. Your current time is: `}
            >
              <Button
                className="green"><Clock />
              </Button>
            </Note>
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
                options={preps !== 'every' ?
                  firstPart.unitOpts[preps] :
                  (isSuperAdmin ?
                    firstPart.unitOpts[preps].superAdminUser :
                    firstPart.unitOpts[preps].normalUser)}
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