import {Meteor} from 'meteor/meteor';
import moment from 'moment';
import {Elastic} from '../../elastic';

/**
 *
 * @param country
 * @return {{migrate: (function())}}
 */
const customers = ({country}) => {
  const
    runDate = new Date(), // running time
    {
      elastic: {indexPrefix: prefix}, // elastic index prefix
      public: {env} // running environment
    } = Meteor.settings,
    suffix = moment(runDate).format('YYYY.MM.DD-HH.mm'), // elastic index suffix
    {Logger} = require('/imports/api/logger'),
    alias = `${prefix}_${country}_${env}`
    ;

  return {
    reindex: ({options = {refresh: true, waitForCompletion: true}}) => {
      const
        actionName = 'REINDEX_CUSTOMERS',
        source = {
          index: `icare_${env}_${country}`,
          type: 'b2b_customer',
        },
        dest = {
          index: `${prefix}_${country}_${env}-${suffix}`,
          type: 'customers',
        },
        script = {
          inline: ""
        };
      let result = {};

      // console.log('customer.reindex', {runDate, actionName, source, dest});

      try {
        // docs: https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference.html#api-reindex
        const result = Elastic.reindex({
          ...options,
          body: {
            source,
            dest,
            script
          }
        });

        console.log('info', result);
        Logger.info({name: actionName, message: JSON.stringify(result)});
        result.result = {name: actionName, message: JSON.stringify(e)};
      } catch (e) {
        /* Failed */
        console.log('error', JSON.stringify(e));
        Logger.error({name: actionName, message: JSON.stringify(e)});
        result.error = {name: actionName, message: JSON.stringify(e)};
      }

      return result;
    },
  }
};

export default customers