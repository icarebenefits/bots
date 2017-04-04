import {Meteor} from 'meteor/meteor';
import moment from 'moment';
import bodybuilder from 'bodybuilder';
import accounting from 'accounting';

import {Logger} from '/imports/api/logger';
import {Elastic} from '../../elastic';
import scripts from './scripts';
const {batches} = Meteor.settings.elastic.migration;

/**
 * Function sync customers basic information
 * @param source
 * @param dest
 * @param script
 * @param options
 * @return {*}
 */
const syncCustomersBasicInfo = ({source, dest, script, options}) => {
  const action = 'syncCustomersBasicInfo';
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

    /* Success */
    return {result: {name: action, message: JSON.stringify(result)}};

  } catch (e) {
    /* Failed */
    return {error: {name: action, message: JSON.stringify(e)}};
  }
};

const syncBusinessUnitsBasicInfo = ({source, dest}) => {
  const action = 'syncCustomersBasicInfo';
  /* get all _id of business units */
  const
    {index, type} = dest,
    body = {
      query: {
        match_all: {}
      }
    };

  try {
    // get total customers
    const {hits: {total, hits}} = Elastic.search({
      index,
      type,
      body,
      size: 0,
    });

    if (total > 0) {
      /* get business units for all customers */
      for (let i = 0; i < total; i += batches) {
        body.from = i;
        body.size = batches;

        try {
          const {hits: {total, hits: customers}} = Elastic.search({
            index,
            type,
            _source: false,
            body,
          });

          customers.map(cus => {
            const {_id} = cus;
            const
              {index, type} = source,
              body = bodybuilder()
                .query('term', 'netsuite_customer_id', _id)
                .build()
              ;
            try {
              body.size = 0;
              const {hits: {total}} = Elastic.search({
                index,
                type,
                body,
              });
              if (total > 0) {
                for (let i = 0; i < total; i += batches) {
                  body.from = i;
                  body.size = batches;

                  const {hits: {hits}} = Elastic.search({
                    index,
                    type,
                    body,
                  });

                  const BUs = hits.map(({_source}) => {
                    /* remove unused fields */
                    delete _source.country;
                    delete _source.type;
                    delete _source["@timestamp"];
                    delete _source["@version"];
                    delete _source.type;
                    delete _source.type;

                    return _source;
                  });

                  try {
                    const {index, type} = dest;
                    const addBUs = Elastic.update({
                      index,
                      type,
                      id: _id,
                      body: {
                        doc: {
                          business_units: BUs
                        }
                      }
                    });

                  } catch (e) {
                    /* Failed */
                    Logger.warn({name: 'syncBusinessUnitsBasicInfo', message: JSON.stringify(e)});
                  }
                }
              } else {
                Logger.warn({
                  name: 'syncBusinessUnitsBasicInfo',
                  message: JSON.stringify({index, type, body})
                });
              }
            } catch (e) {
              Logger.warn({name: 'syncBusinessUnitsBasicInfo', message: JSON.stringify(e)});
            }
          });
        } catch (e) {
          /* Failed */
          Logger.warn({name: 'syncBusinessUnitsBasicInfo', message: JSON.stringify(e)});
        }
      }

      // Finish sync
      return {result: {}};

    } else {
      return {result: {name: action, message: JSON.stringify({total, hits})}};
    }
  } catch (e) {
    /* Failed */
    return {error: {name: action, message: JSON.stringify(e)}};
  }
};

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
    alias = `${prefix}_${country}_${env}`
    ;

  return {
    migrate: () => {
      const
        source = {
          index: `icare_${env}_${country}`,
          type: 'b2b_customer',
        },
        dest = {
          index: `${prefix}_${country}_${env}-${suffix}`,
          type: 'customers',
        },
        {lang, bots: {customers: {netsuiteId, customerId, name}}} = scripts,
        script = {
          lang,
          inline: `${netsuiteId};${customerId};${name}`
        },
        options = {refresh: true, waitForCompletion: true};

      console.log('syncCustomersBasicInfo', {runDate, source, dest, script, options});
      /* sync customers basic information */
      const {error, result} = syncCustomersBasicInfo({source, dest, script, options});
      if (error) {
        /* failed */
        Logger.error(error);
      } else {
        /* success */
        Logger.info(result);

        /* sync business units basic information */
        const
          source = {
            index: `${prefix}_${country}_${env}_tmp`,
            type: 'business_units',
          },
          dest = {
            index: `${prefix}_${country}_${env}-${suffix}`,
            type: 'customers',
          };
        const {error, result} = syncBusinessUnitsBasicInfo({source, dest});
        if (error) {
          return {error: {name: 'MIGRATE_CUSTOMERS', message: error}}
        } else {
          const finishDate = new Date();
          const runTime = accounting
            .formatNumber(Number(moment(finishDate).diff(moment(runDate), 'seconds')));

          return {result: {
            name: 'MIGRATE_CUSTOMERS',
            message: {runTime: `${runTime} seconds`, result}}};
        }
      }
    }
  }
};

export default customers