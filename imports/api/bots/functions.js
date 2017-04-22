import {Meteor} from 'meteor/meteor';
import bodybuilder from 'bodybuilder';
import accounting from 'accounting';
import _ from 'lodash';
// collections
import {SLAs} from '../collections/slas';
// fields
import {Field} from '/imports/api/fields';
// functions
import {Facebook} from '../facebook-graph';
import {QueryBuilder} from '../query-builder';
import format from 'string-template';
import Methods from '../collections/slas/methods';
import {Elastic, ESFuncs} from '../elastic';
// utils
import {formatMessage} from '/imports/utils/defaults';

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
 * check the sla base on conditions and message
 * @param slaId
 * @return {*}
 */
const checkSLA = (slaId) => {
  const sla = SLAs.findOne({_id: slaId});
  if (!_.isEmpty(sla)) {
    const {name, conditions, workplace, message: {variables, messageTemplate}, country} = sla;
    const {level} = Meteor.settings.log;
    let queries = [];

    /* validate conditions and message */
    if (_.isEmpty(conditions)) {
      throw new Meteor.Error('CONDITIONS_EMPTY');
    }
    if (_.isEmpty(variables) || _.isEmpty(messageTemplate)) {
      throw new Meteor.Error('MESSAGE_EMPTY');
    }

    /* For every variable - build appropriated query
     * and get the aggregation result */
    const vars = {};
    variables.map(aggregation => {
      const
        {summaryType: aggType, group, field, name} = aggregation,
        {type} = Field()[group]().elastic();
      const
        {elastic: {indexPrefix}, public: {env}} = Meteor.settings,
        index = `${indexPrefix}_${country}_${env}`;

      const {error, query: {query}} = QueryBuilder('conditions').build(conditions, aggregation);
      const {error: aggsErr, aggs} = QueryBuilder('aggregation').build(aggregation);

      // console.log('query', JSON.stringify(query))

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
        const {valid} = Elastic.indices.validateQuery({
          index,
          type,
          body: {query}
        });
        if (!valid) {
          throw new Meteor.Error('VALIDATE_ES_QUERY_FAILED', JSON.stringify(query));
        } else {
          let agg = {};
          try {
            const {aggregations} = Elastic.search({
              index,
              type,
              body: ESQuery
            });
            agg = aggregations;
          } catch(e) {
            console.log({name: 'checkSLA', message: JSON.stringify(e)});
          }

          if (!_.isEmpty(agg)) {
            let ESField = '';
            if (field === 'total') {
              ESField = Field()[group]().elastic().id;
            } else {
              ESField = Field()[group]().field()[field]().elastic().field;
            }
            const {value} = agg[`agg_${aggType}_${ESField}`];

            vars[name] = accounting.formatNumber(value, 0);
          }
        }
      }
    });

    /* Build message */
    let message = `# ${name} \n`;
    message = message + format(messageTemplate, vars);
    if(level === 'debug') {
      message = `${message} \n **Query** \n \`\`\`${JSON.stringify(queries, null, 2)} \n \`\`\``;
    }
    // message = `${message} \n\n **@Powered by** [iCare-bots](bots.stage.icbsys.net)`;

    /* Send message to workplace */
    Facebook().postMessage(workplace, message)
      .then(res => console.log('postMessage', JSON.stringify(res)))
      .catch(e => console.log('postMessageError', JSON.stringify(e)));
    Methods.setLastExecutedAt.call({_id: slaId, lastExecutedAt: new Date()});

    return {
      check: true,
      notify: true,
    };

  } else {
    return {
      check: false,
      notify: false,
      error: 'SLA_NOT_FOUND'
    };
  }
};

const addWorkplaceSuggester = (next, total = 0) => {
  /* Fetch groups from fb@work */
  const {adminWorkplace} = Meteor.settings.facebook;
  Facebook().fetchGroups(next)
    .then(
      res => {
        const {data, paging: {next}} = JSON.parse(res);
        if(_.isEmpty(data)) {
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
          if(next) {
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
  addWorkplaceSuggester,
};

/* Test checking SLA */
// checkSLA('aKZ46h83jhBao7FEb');

export default Bots