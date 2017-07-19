import {Meteor} from 'meteor/meteor';
import {check, Match} from 'meteor/check';
import _ from 'lodash';
import momentTZ from 'moment-timezone';
import moment from 'moment';
import S from 'string';
import dateMath from '@elastic/datemath';
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
      case 'second':
      case 'seconds':
        return {
          suffix: moment(runDate).format('YYYY.MM.DD-HH.mm.ss')
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

const relativeOptions = [
  { text: 'Seconds ago', value: 's' },
  { text: 'Minutes ago', value: 'm' },
  { text: 'Hours ago', value: 'h' },
  { text: 'Days ago', value: 'd' },
  { text: 'Weeks ago', value: 'w' },
  { text: 'Months ago', value: 'M' },
  { text: 'Years ago', value: 'y' },

  { text: 'Seconds from now', value: 's+' },
  { text: 'Minutes from now', value: 'm+' },
  { text: 'Hours from now', value: 'h+' },
  { text: 'Days from now', value: 'd+' },
  { text: 'Weeks from now', value: 'w+' },
  { text: 'Months from now', value: 'M+' },
  { text: 'Years from now', value: 'y+' },

];
export function parseRelativeString(part) {
  let results = {};
  const matches = _.isString(part) && part.match(/now(([\-\+])([0-9]+)([smhdwMy])(\/[smhdwMy])?)?/);

  const isNow = matches && !matches[1];
  const opperator = matches && matches[2];
  const count = matches && matches[3];
  const unit = matches && matches[4];
  const roundBy = matches && matches[5];

  if (isNow) {
    return { count: 0, unit: 's', round: false };
  }

  if (count && unit) {
    results.count = parseInt(count, 10);
    results.unit = unit;
    if (opperator === '+') results.unit += '+';
    results.round = roundBy ? true : false;
    return results;

  } else {
    results = { count: 0, unit: 's', round: false };
    const duration = moment.duration(moment().diff(dateMath.parse(part)));
    const units = _.pluck(_.clone(relativeOptions).reverse(), 'value')
      .filter(s => /^[smhdwMy]$/.test(s));
    let unitOp = '';
    for (let i = 0; i < units.length; i++) {
      const as = duration.as(units[i]);
      if (as < 0) unitOp = '+';
      if (Math.abs(as) > 1) {
        results.count = Math.round(Math.abs(as));
        results.unit = units[i] + unitOp;
        results.round = false;
        break;
      }
    }
    return results;
  }


}

export function parseRelativeParts(from, to) {
  const results = {};
  results.from = parseRelativeString(from);
  results.to = parseRelativeString(to);
  if (results.from && results.to) return results;
}

const Parser = () => ({
  scheduleText: parseScheduleText,
  dateInTimezone: parseDateInTimezone,
  indexSuffix: parseIndexSuffix,
  dateFromIndexName: parseDateFromIndexName,
  elasticRelativeString: parseRelativeString,
  elasticRelativeParts: parseRelativeParts
});

export default Parser