import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import S from 'string';
import moment from 'moment';
import _ from 'lodash';

export const IDValidator = {
  _id: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  }
};

export const getScheduleText = (freq) => {
  const
    {preps, range, unit, preps2, range2} = freq;
  let text = '';

  !_.isEmpty(preps) && (text = `${preps}`);
  !_.isEmpty(range) && (text = `${text} ${range}`);
  !_.isEmpty(unit) && (preps === 'at') ? (text = `${text}:${unit}`) : (text = `${text} ${unit}`);
  !_.isEmpty(preps2) && (text = `${text} ${preps2}`);
  !_.isEmpty(range2) && (text = `${text} ${range2}`);

  return text;
};

export const searchSLAList = (SLAs, WPs, search) => {
  return SLAs.filter(s => {
    const
      {name, frequency, lastExecutedAt} = s,
      wp = WPs.filter(w => w.id === Number(s.workplace))
    let
      wpName = '';
    if (!_.isEmpty(wp)) {
      wpName = wp[0].name
    }
    
    const searchText = name.toLowerCase() + ' ' +
      S(wpName.toLowerCase()) + ' ' +
      S(getScheduleText(frequency).toLowerCase()) + ' ' +
      S(moment(new Date(lastExecutedAt)).format('LLL').toLowerCase());
    // console.log('searchText', searchText);

    return S(searchText).contains(search);
  });
};

export const getIndexSuffix = (runDate, unit) => {
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
        throw new Meteor.Error('GET_INDEX_SUFFIX', `Unsupported Unit: ${unit}`)
    }
  } catch(err) {
    throw new Meteor.Error('GET_INDEX_SUFFIX', err.message);
  }
};

/* Parser */
export {default as Parser} from './parser';

/* Defaults */
export * from './defaults';


