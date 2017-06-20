import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check';
import S from 'string';
import {Parser} from '/imports/utils';

import {ETL} from '/imports/api/olap';
import {Elastic} from '/imports/api/elastic';

/**
 * Function
 * @param country
 */
const migrateToElastic = async(country = 'kh') => {
  if (Meteor.isServer) {
    try {
      const result = await ETL(country).customer();
      return result;
    }
    catch (err) {
      throw new Meteor.Error('migrateToElastic', err.message);
    }
  }
};

/**
 * Function
 * @param country
 */
const indexRFM = async(country = 'kh') => {
  if (Meteor.isServer) {
    try {
      const result = await ETL(country).rfm();
      return result;
    }
    catch (err) {
      throw new Meteor.Error('indexRFM', err.message);
    }
  }
};

const indexSuggests = ({index, type, data}) => {
  check(index, String);
  check(type, String);
  check(data, [Object]);

  /* index suggests*/
  let count = 0;
  data.map(group => {
    const {name = '', id} = group;
    const input = [];
    const names = name.split(' ');
    const max = names.length;
    for (let i = 0; i < max; i++) {
      input.push(names.join(' '));
      names.shift();
    }

    const result = Elastic.index({
      index, type, id, body: {
        suggest: {
          input
        },
        ...group
      }
    });
    if (result.error) {
      throw new Meteor.Error('indexSuggests.Failed', {id});
    } else {
      count++;
    }
  });

  return count;
};

/**
 * Function getIndexingDate of an alias
 * @param alias
 * @param country
 * @returns Promise
 */
const getIndexingDate = async({alias, country}) => {
  check(alias, String);
  check(country, String);

  try {
    const
      {ElasticClient: Elastic} = require('/imports/api/elastic'),
      {timezone} = Meteor.settings.public.countries[`${country}`],
      result = await Elastic.indices.getAlias({name: alias}),
      index = Object.keys(result)[0],
      indexSplited = S(index)
        .replaceAll('.', '').s
        .split('-'),
      lastUpdatedDate = indexSplited[1] + 'T' + indexSplited[2];

    // console.log('index, timezone', lastUpdatedDate, timezone);
    return {
      lastUpdatedDate: Parser().dateInTimezone(lastUpdatedDate, timezone).format('LLL'),
      timezone
    };
  } catch (err) {
    throw new Meteor.Error('getIndexingDate', err.message);
  }
};

const Functions = {
  migrateToElastic,
  indexSuggests,
  getIndexingDate,
  indexRFM
};

export default Functions