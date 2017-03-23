import bodybuilder from 'bodybuilder';

import {SLAs} from '../collections/slas';
// import {Elastic} from '../elastic';
import {FbRequest} from '../facebook';
import {queryBuilder} from '../query-builder';
import format from 'string-template';

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
  const {took, timed_out, hits: {total, hits: data}} = Elastic.search({
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
  const {_id, conditions, workplace, message: {variables, messageTemplate}} = sla;
  // const threshold = 

  const {error, query} = queryBuilder(conditions);

  if (error) {
    throw new Meteor.Error('BUILD_ES_QUERY_FAILED', error);
  } else {

    const {Elastic} = require('../elastic');

    // validate query before run
    const {valid} = Elastic.indices.validateQuery({body: query});
    if (valid) {
      const {hits: {total, hits}} = Elastic.search({body: query});
      if (hits) {
        const vars = {};
        // build message to send to workplace
        variables.map(v => {
          const {summaryType, field, name} = v;
          if (field === 'total' && summaryType === 'count') {
            vars[name] = total;
          } else {
            // handle orther type of result from aggregation
            // not support yet
            throw new Meteor.Error('CANT_HANDLE_SUMMARY', `${summaryType} of ${field} isn't supported yet.`)
          }
        });
        const message = format(messageTemplate, vars);

        // send message to workplace
        const wpRequest = new FbRequest();
        const {personalId} = Meteor.settings.facebook;
        wpRequest.post(personalId, workplace, message);
        return {
          check: true,
          notify: true,
        };
      } else {
        throw new Meteor.Error('EXECUTE_ES_QUERY_FAILED');
      }
    } else {
      throw new Meteor.Error('VALIDATE_ES_QUERY_FAIELD');
    }
  }

};

const Bots = {
  fistSLACheck,
  executeElastic,
};

export default Bots