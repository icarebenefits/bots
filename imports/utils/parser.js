import {Meteor} from 'meteor/meteor';
import {check, Match} from 'meteor/check';
import _ from 'lodash';
import momentTZ from 'moment-timezone';
import moment from 'moment';
import S from 'string';
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

/**
 * Parse the runDate to Index suffix base on the unit
 * @param runDate
 * @param unit - day/days | hour/hours | minute/minutes
 * @returns {{suffix: string}}
 */
const parseIndexSuffix = (runDate, unit) => {
  check(runDate, Date);
  check(unit, String);
  try {
    switch (unit) {
      case 'day':
      case 'days':
        return {
          suffix: moment(runDate).format('YYYY.MM.DD')
        };
      case 'hour':
      case 'hours':
        return {
          suffix: moment(runDate).format('YYYY.MM.DD-HH')
        };
      case 'minute':
      case 'minutes':
        return {
          suffix: moment(runDate).format('YYYY.MM.DD-HH.mm')
        };
      default:
        throw new Meteor.Error('PARSE_INDEX_SUFFIX', `Unsupported Unit: ${unit}`)
    }
  } catch(err) {
    throw new Meteor.Error('PARSE_INDEX_SUFFIX', err.message);
  }
};

/**
 * Parse date from Index name, the deeper of returned date base on unit
 * @param indexName
 * @param unit
 * @returns {{suffix: string}}
 */
const parseDateFromIndexName = (indexName, unit) => {
  check(indexName, String);
  check(unit, String);
  try {
    const indexSplited = indexName.split('-');
    let dateString = '';
    switch (unit) {
      case 'day':
      case 'days':
      {
        dateString = indexSplited[1];
        break;
      }
      case 'hour':
      case 'hours':
      {
        dateString = indexSplited[1] + 'T' + indexSplited[2].split('.')[0];
        break;
      }
      case 'minute':
      case 'minutes':
      {
        dateString = indexSplited[1] + 'T' + indexSplited[2];
        break;
      }
      default:
        throw new Meteor.Error('PARSE_DATE_FROM_INDEX_NAME', `Unsupported Unit: ${unit}`)
    }

    dateString = S(dateString).replaceAll('.', '').s;
    return {
      date: new Date(moment(dateString))
    };
  } catch(err) {
    throw new Meteor.Error('PARSE_DATE_FROM_INDEX_NAME', err.message);
  }
};

const Parser = () => ({
  scheduleText: parseScheduleText,
  dateInTimezone: parseDateInTimezone,
  indexSuffix: parseIndexSuffix,
  dateFromIndexName: parseDateFromIndexName
});

export default Parser