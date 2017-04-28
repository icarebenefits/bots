import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check';
import {Promise} from 'meteor/promise';

import {ETL} from '/imports/api/olap';
import {Elastic} from '/imports/api/elastic';
import {Facebook} from '/imports/api/facebook-graph';

/**
 * Function
 * @param country
 */
const migrateToElastic = (country = 'kh') => {
  if(Meteor.isServer) {
    try {
      const {facebook: {adminWorkplace}} = Meteor.settings;
      ETL(country).customer()
        .then(res => {
          /* Post result to Workplace */
          const {message} = res;
          Facebook().postMessage(adminWorkplace, message);
        })
        .catch(err => {
          const message = formatMessage({heading1: 'REINDEX_CUSTOMER_TYPES', code: {error: err}});
          Facebook().postMessage(adminWorkplace, message);
        });

    }
    catch (e) {
      throw new Meteor.Error('migrateToElastic', JSON.stringify(e));
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
    for(let i = 0; i < max; i++) {
      input.push(names.join(' '));
      names.shift();
    }

    const result = Elastic.index({index, type, id, body: {
      suggest: {
        input
      },
      ...group
    }});
    if(result.error) {
      throw new Meteor.Error('indexSuggests.Failed', {id});
    } else {
      count++;
    }
  });

  return count;
};

const Functions = {
  migrateToElastic,
  indexSuggests,
};

export default Functions