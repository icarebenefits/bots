import {Meteor} from 'meteor/meteor';
import accounting from 'accounting';
import _ from 'lodash';
import moment from 'moment';
import {Promise} from 'meteor/promise';
// collections
import {SLAs} from '../collections/slas';
// fields
import {Field, getESField} from '/imports/api/fields';
// functions
import {Facebook} from '../facebook-graph';
import {QueryBuilder} from '../query-builder';
import format from 'string-template';
import Methods from '../collections/slas/methods';
import {ESFuncs} from '../elastic';
// utils
import {formatMessage} from '/imports/utils/defaults';

/**
 * Function for checking operation of bot
 * @return {*}
 */
const fistSLACheck = () => {
  return {
    check: true,
    notify: true,
  };
};

/**
 * Execute SLA - server & client
 * @param SLA
 * @param preview
 * @return {{check: boolean, notify: boolean, message: string, queries: Array}}
 */
export const executeSLA = async ({SLA}) => {
  if (_.isEmpty(SLA)) {
    throw new Meteor.Error('EXECUTE_SLA', 'SLA is required.');
  }
  const {name, conditions, message: {useBucket, bucket, variables, messageTemplate}, country} = SLA;
  let queries = [];

  /* validate conditions and message */
  // if (_.isEmpty(conditions)) {
  //   throw new Meteor.Error('EXECUTE_SLA', 'Conditions is required');
  // }
  if (_.isEmpty(variables) || _.isEmpty(messageTemplate)) {
    throw new Meteor.Error('EXECUTE_SLA', 'Message is required.');
  }

  /* For every variable - build appropriated query
   * and get the aggregation result */
  const vars = {};
  const
    {elastic: {indexPrefix}, public: {env}} = Meteor.settings,
    index = `${indexPrefix}_${country}_${env}`;

  const promiseArray = variables.map(async (aggregation) => {
    const
      {summaryType: aggType, group, field, name, bucket: applyBucket} = aggregation,
      {type} = Field()[group]().elastic();

    const {error, query: {query}} = QueryBuilder('conditions').build(conditions, aggregation);
    const {error: aggsErr, aggs} = QueryBuilder('aggregation').build(useBucket, bucket, aggregation);

    if (error || aggsErr) {
      throw new Meteor.Error('BUILD_ES_QUERY_FAILED', error);
    } else {
      // build the query
      const ESQuery = {
        query,
        aggs,
        size: 0 // just need the result of total and aggregation, no need to fetch ES documents
      };

      queries.push({index, type, ESQuery});

      const {Elastic} = require('../elastic');
      // validate query before run
      const {valid} = await Elastic.indices.validateQuery({
        index,
        type,
        body: {query}
      });
      if (!valid) {
        throw new Meteor.Error('VALIDATE_ES_QUERY_FAILED', JSON.stringify(query));
      } else {
        let agg = {};
        try {
          const {aggregations} = await Elastic.search({
            index,
            type,
            body: ESQuery
          });
          agg = aggregations;
        } catch (err) {
          throw new Meteor.Error('BUILD_AGGS_QUERY', `Failed: ${err.message}`);
        }

        if (!_.isEmpty(agg)) {
          const ESField = getESField(aggType, group, field);

          if(useBucket && applyBucket) {
            const {type, group, field} = bucket;
            let bucketField = getESField('', group, field);
            if (_.isEmpty(type) || _.isEmpty(group) || _.isEmpty(field)) {
              throw new Meteor.Error('buildAggregation', `Bucket is missing data.`);
            }
            
            if(type === 'terms') {
              bucketField = `${bucketField}.keyword`;
            }
            const {buckets} = agg[`agg_${type}_${bucketField}`];
            if(!_.isEmpty(buckets)) {
              let mess = '';
              buckets.map(b => {
                let key = b.key;
                const value = accounting.formatNumber(b[`agg_${aggType}_${ESField}`].value, 0);
                if(type === 'date_histogram') {
                  key = moment(key).format('LL');
                }
                mess = `${mess} \n - ${key}: ${value} \n`;
              });
              vars[name] = mess;
            } else {
              vars[name] = 'No result.';
            }
          } else {
            const {value} = agg[`agg_${aggType}_${ESField}`];
            vars[name] = accounting.formatNumber(value, 0);
          }
        }
      }
    }
  });
  await Promise.all(promiseArray);

  const {lastUpdatedDate: lastUpdatedOn, timezone} = await ESFuncs.getIndexingDate({alias: index, country})

  /* Build message */
  let message = `## ${name} \n`;
  message = message + format(messageTemplate, vars);
  message = formatMessage({message, quote: `Data was last updated on: ${lastUpdatedOn} (${timezone})`});

  return {
    executed: true,
    message,
    queries
  };
};

/**
 * Execute SLA - server
 * @param slaId
 * @param isPreview
 * @return {{check: boolean, notify: boolean, message: string}}
 */
const checkSLA = (slaId) => {
  try {
    const SLA = SLAs.findOne({_id: slaId});
    if (!_.isEmpty(SLA)) {
      executeSLA({SLA, slaId})
        .then(result => {
          if (result.executed) {
            const {message, queries} = result;
            let mess = message;
            /* Send message to workplace */
            const {level} = Meteor.settings.log;
            if (level === 'debug') {
              mess = `${mess} \n **Query** \n \`\`\`${JSON.stringify(queries, null, 2)} \n \`\`\``;
            }
            Facebook().postMessage(SLA.workplace, mess)
              .then(res => console.log('postMessage', JSON.stringify(res)))
              .catch(e => console.log('postMessage.Error', JSON.stringify(e)));
            // Track execute SLA
            Methods.setLastExecutedAt.call({_id: slaId, lastExecutedAt: new Date()});
          }
        })
        .catch(err => {
          throw new Meteor.Error('EXECUTE_SLA', err.message);
        });
    } else {
      throw new Meteor.Error('EXECUTE_SLA', 'SLA not found.');
    }
  } catch (err) {
    throw new Meteor.Error('EXECUTE_SLA', err.message);
  }
};

const addWorkplaceSuggester = (next, total = 0) => {
  /* Fetch groups from fb@work */
  const {adminWorkplace} = Meteor.settings.facebook;
  Facebook().fetchGroups(next)
    .then(
      res => {
        const {data, paging: {next}} = JSON.parse(res);
        if (_.isEmpty(data)) {
          const message = formatMessage({
            message: '',
            heading1: 'addWorkplaceSuggester.NoGroupFound',
            code: res
          });
          Facebook().postMessage(adminWorkplace, message);
        } else {
          /* index suggester */
          const {suggester: {workplace: {index, type}}} = Meteor.settings.elastic;
          total += ESFuncs.indexSuggests({index, type, data});
          if (next) {
            addWorkplaceSuggester(next, total);
          } else {
            const message = formatMessage({
              message: '',
              heading1: 'addWorkplaceSuggester.IndexedSuggests',
              code: {total}
            });
            Facebook().postMessage(adminWorkplace, message);
          }
        }
      }
    )
    .catch(e => {
      const message = formatMessage({
        message: '',
        heading1: 'addWorkplaceSuggester.Error',
        code: e
      });
      Facebook().postMessage(adminWorkplace, message);
    })
};

const Bots = {
  fistSLACheck,
  checkSLA,
  executeSLA,
  addWorkplaceSuggester,
};

/* Test checking SLA */
// checkSLA('aKZ46h83jhBao7FEb');

export default Bots