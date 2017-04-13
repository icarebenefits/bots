import {Meteor} from 'meteor/meteor';
import bodybuilder from 'bodybuilder';
import accounting from 'accounting';
import _ from 'lodash';
// collections
import {SLAs} from '../collections/slas';
// fields
import {FieldsGroups} from '/imports/api/fields';
// functions
import {FbRequest} from '../facebook';
import {queryBuilder, aggsBuilder} from '../query-builder';
import format from 'string-template';
import Methods from '../collections/slas/methods';
import {Elastic} from '../elastic';

/**
 * Function for checking operation of bot
 * @return {*}
 */
const fistSLACheck = () => {
  const personId = '100015398923627', workplace = '257279828017220';
  const index = 'icare_prod_kh', type = 'b2b_customer';
  const body = bodybuilder()
    .filter('range', 'number_employees', {lt: 100})
    .build();
  const threshold = 25;
  let message = '';

  // check result
  const {hits: {total}} = Elastic.search({
    index,
    type,
    body,
  });

  // send notify to workplace
  if (total) {
    if (total > threshold) {
      message = `Test bots: There are ${total} customers who has less than 100 iCare Members.`;
      const wpRequest = new FbRequest();
      wpRequest.post(personId, workplace, message);
      return {
        check: true,
        notify: true,
      };
    } else {
      return {
        check: true,
        notify: false,
        total,
      };
    }
  } else {
    return {
      check: false,
      notify: false,
    };
  }
};

/**
 * Function execute the bot operation
 * @param {String} slaId
 */
const executeElastic = (slaId) => {
  const sla = SLAs.findOne({_id: slaId});

  if (!_.isEmpty(sla)) {
    const {name, conditions, workplace, message: {variables, messageTemplate}, country} = sla;

    /* validate conditions and message */
    if (_.isEmpty(conditions)) {
      throw new Meteor.Error('CONDITIONS_EMPTY');
    }
    if (_.isEmpty(variables) || _.isEmpty(messageTemplate)) {
      throw new Meteor.Error('MESSAGE_EMPTY');
    }

    const {error, query: {query}} = queryBuilder(conditions);
    const {error: aggsErr, aggs} = aggsBuilder(variables);


    if (error || aggsErr) {
      throw new Meteor.Error('BUILD_ES_QUERY_FAILED', error);
    } else {
      // build the query
      const ESQuery = {
        query,
        aggs,
        size: 0 // just need the result of total and aggregation, no need to fetch ES documents
      };

      const {Elastic} = require('../elastic');

      // validate query before run
      const {valid} = Elastic.indices.validateQuery({body: {query}});
      if (valid) {
        const {elastic: {indexPrefix}, public: {env}} = Meteor.settings;
        // get index types from conditions
        const types = _.uniq(conditions.map(c => FieldsGroups[c.group].props.ESType));
        const {hits, aggregations} = Elastic.search({
          index: `${indexPrefix}_${country}_${env}`,
          type: types.join(),
//           type: esType,
          body: ESQuery
        });

        // console.log('es query', {index: `${indexPrefix}_${country}_${env}`, type: types.join(), body: JSON.stringify(ESQuery)});
        //
        // console.log(aggregations)
        if (!_.isEmpty(aggregations)) {
          // handle count total
          if (!_.isEmpty(hits)) {
            const vars = {};
            // build message to send to workplace
            variables.map(v => {
              // const {total} = hits;
              const {summaryType, group, field, name} = v;

              let
                type = summaryType,
                ESField = ''
                ;
              if (field === 'total') {
                ESField = 'id';
              } else {
                ESField = FieldsGroups[group].fields[field]().props.ESField;
              }

              const {value} = aggregations[`agg_${type}_${ESField}`];
              vars[name] = Number(value) === 0 ? 'no' : accounting.formatNumber(value, 0);
            });
            const message = format(`${name}: ${messageTemplate}`, vars);

            // send message to workplace
            const wpRequest = new FbRequest();
            const {personalId} = Meteor.settings.facebook;
            wpRequest.post(personalId, workplace, message);
            Methods.setLastExecutedAt.call({_id: slaId, lastExecutedAt: new Date()});

            return {
              check: true,
              notify: true,
            };
          } else {
            throw new Meteor.Error('NO_MATCHED_DOCUMENTS');
          }
        } else {
          throw new Meteor.Error('MESSAGE_VALUES_NOT_FOUND');
        }
      } else {
        throw new Meteor.Error('VALIDATE_ES_QUERY_FAIELD');
      }
    }
  } else {
    throw new Meteor.Error('SLA_NOT_FOUND');
  }
};

const checkSLA = (slaId) => {
  const sla = SLAs.findOne({_id: slaId});
  if (!_.isEmpty(sla)) {
    const {name, conditions, workplace, message: {variables, messageTemplate}, country} = sla;

    /* validate conditions and message */
    if (_.isEmpty(conditions)) {
      throw new Meteor.Error('CONDITIONS_EMPTY');
    }
    if (_.isEmpty(variables) || _.isEmpty(messageTemplate)) {
      throw new Meteor.Error('MESSAGE_EMPTY');
    }

    console.log('variables', JSON.stringify(variables, null, 2));
    console.log('conditions', JSON.stringify(conditions, null, 2));

  } else {
    throw new Meteor.Error('SLA_NOT_FOUND');
  }
};

const Bots = {
  fistSLACheck,
  executeElastic,
  checkSLA,
};

export default Bots