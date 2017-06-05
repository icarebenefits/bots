import {check, Match} from 'meteor/check';
import _ from 'lodash';
import momentTZ from 'moment-timezone';
/**
 * Parse a schedule object to later.js schedule text
 * @param {Object} schedule
 * @return {String} later.js schedule text
 */
const parseScheduleText = (schedule) => {
  check(schedule, Object);
  const
    {preps, range, unit, preps2, range2} = schedule;
  let text = '';

  !_.isEmpty(preps) && (text = `${preps}`);
  !_.isEmpty(range) && (text = `${text} ${range}`);
  !_.isEmpty(unit) && (preps === 'at') ? (text = `${text}:${unit}`) : (text = `${text} ${unit}`);
  !_.isEmpty(preps2) && (text = `${text} ${preps2}`);
  !_.isEmpty(range2) && (text = `${text} ${range2}`);

  return text.trim();
};

/**
 * Function parse Date into a specific timezone
 * @param date
 * @param timezone
 * @returns {*} a moment object
 */
const parseDateInTimezone = (date, timezone) => {
  // date in string date format or Date type
  check(date, Match.OneOf(String, Date));
  check(timezone, String);
  if(! momentTZ(date).isValid()) 
    throw new Meteor.Error('parseDateInTimezone', 'date parameter is not a valid Date format.')
  
  // set default timezone
  momentTZ.tz.setDefault('UTC');
  return momentTZ(date).tz(timezone);
};

const Parser = () => ({
  scheduleText: parseScheduleText,
  dateInTimezone: parseDateInTimezone
});

export default Parser