import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check';
import S from 'string';
import {Parser} from '/imports/utils';
import {Promise} from 'meteor/promise';

import {ETL} from '/imports/api/olap';
import {ElasticClient as Elastic} from '/imports/api/elastic';

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

const indexSuggests = async({index, type, data}) => {
  check(index, String);
  check(type, String);
  check(data, [Object]);

  try {
    /* index suggests*/
    let count = 0;
    await Promise.all(data.map(async(group) => {
      const {name = '', id} = group;
      const input = [];
      const names = name.split(' ');
      const max = names.length;
      for (let i = 0; i < max; i++) {
        input.push(names.join(' '));
        names.shift();
      }

      const result = await Elastic.index({
        index, type, id, body: {
          suggest: {
            input
          },
          ...group
        }
      });
      count++;

      return count;
    }));
  } catch(err) {
    throw new Meteor.Error('indexSuggests', err.message);
  }
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