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

export const cleanupArray = (arr) => {
  check(arr, Array);

  // remove ALL empty values ("", null, undefined and 0)
  // return arr.filter(e =>  e));

  // keep "0" in the array and remove anything else (null, undefined and "")
  return arr.filter(e => (e === 0 || e));
};

export const conciseNumber = (n, de) => {
  let x = ('' + n).length, p = Math.pow, d = p(10, de);
  x -= x % 3
  return Math.round(n * d / p(10, x)) / d + " kmbTPE"[x / 3]
};

/* Parser */
export {default as Parser} from './parser';

/* Defaults */
export * from './defaults';


