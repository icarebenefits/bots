import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import S from 'string';
import moment from 'moment';

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

/* Parser */
export {default as Parser} from './parser';

/* Defaults */
export * from './defaults';


