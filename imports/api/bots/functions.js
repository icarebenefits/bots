import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check';
import accounting from 'accounting';
import _ from 'lodash';
import S from 'string';
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
  const {Elastic} = require('../elastic');
  const {Facebook} = require('/imports/api/facebook-graph');
  if (_.isEmpty(SLA)) {
    throw new Meteor.Error('EXECUTE_SLA', 'SLA is required.');
  }
  const {name, conditions, message: {useBucket, bucket, variables, messageTemplate}, country} = SLA;
  let queries = [], tags = [];

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
          const ESField = getESField(aggType, group, field, bucket.isNestedField && applyBucket, bucket.field);

          if (useBucket && applyBucket) {
            const {type, group, field, options, isNestedField} = bucket;
            let bucketField = getESField('', group, field, bucket.isNestedField && applyBucket, bucket.field);
            if (_.isEmpty(type) || _.isEmpty(group) || _.isEmpty(field)) {
              throw new Meteor.Error('buildAggregation', `Bucket is missing data.`);
            }

            if (type === 'terms') {
              bucketField = `${bucketField}.keyword`;
            }
            let bucketsAgg = agg[`agg_${type}_${bucketField}`];
            if (isNestedField) {
              bucketsAgg = agg[bucketField.split('.')[0]][`agg_${type}_${bucketField}`];
            }
            const {buckets} = bucketsAgg;
            if (!_.isEmpty(buckets)) {
              let mess = '';
              // limit the number of buckets return
              const
                from = 0,
                {tagBy} = options,
                size = options.size || Meteor.settings.public.elastic.aggregation.bucket.terms.size;
              const result = buckets.slice(from, size);
              // console.log('result', result);
              const promiseArr = result.map(async (b) => {
                let
                  tag = '',
                  key = b.key;
                const value = accounting.formatNumber(b[`agg_${aggType}_${ESField.replace('.', '_')}`].value, 0);
                if (type === 'date_histogram') {
                  key = moment(key).format('LL');
                }
                mess = `${mess} \n - ${key}: ${value} \n`;
                // tag member if tagBy is setup
                if (!_.isEmpty(tagBy)) {
                  if (tagBy === field) {
                    tag = await Facebook().tagMember('', key);
                    // for testing
                    // tag = await Facebook().tagMember('', 'tan.ktm@icarebenefits.com');

                  } else {
                    tag = await Facebook().tagMember('', value);
                    // for testing
                    // tag = await Facebook().tagMember('', 'chris@icarebenefits.com');
                    // if (!_.isEmpty(tag))
                    //   tags.push(tag);
                  }
                  if (!_.isEmpty(tag))
                    tags.push(tag);
                }
              });
              await Promise.all(promiseArr);
              vars[name] = mess;
            } else {
              vars[name] = 'No result.';
            }
          } else {
            const {value} = agg[`agg_${aggType}_${ESField.replace('.', '_')}`];
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

  // tag members
  if (!_.isEmpty(tags)) {
    message += `\n ${tags.join()}`;
  }

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

const addWorkplaceSuggester = async (next, total = 0) => {
  /* Fetch groups from fb@work */
  const {adminWorkplace} = Meteor.settings.facebook;
  try {
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
      total += await ESFuncs.indexSuggests({index, type, data});
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
  } catch (err) {
    const message = formatMessage({
      message: '',
      heading1: 'addWorkplaceSuggester.Error',
      code: err.message
    });
    Facebook().postMessage(adminWorkplace, message);
  }
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

const parseAlarmName = (alarmName) => {
  check(alarmName, String);
  const nameSplited = alarmName.split('-');
  return {metric: nameSplited[nameSplited.length - 1]};
};

const parseStateReason = (state, stateReason) => {
  check(state, String);
  check(stateReason, String);

  let stateValue = 0;
  if (state === 'ALARM') {
    stateValue = Number(S(stateReason).between('[', ']').s.split(' ')[0]);
    console.log('stateValue', stateValue);
  }
  return {stateValue};
};

const processAlarmData = (message) => {
  check(message, Object);
  const {
    AlarmName, AlarmDescription,
    NewStateValue: state, NewStateReason: stateReason,
    StateChangeTime: timestamp,
    // Trigger: {MetricName, Namespace, Dimensions: [{name: dName, value: dValue}]}
  } = message;
  // console.log('Message', AlarmName, state, stateReason, timestamp);

  const {system, service, extraInfo, metric} = parseAlarmName(AlarmName);
  const {stateValue} = parseStateReason(state, stateReason);

  return {
    name: AlarmName,
    system,
    service,
    extraInfo,
    metric,
    state,
    stateValue,
    detail: stateReason,
    timestamp
  };
};

const getAlarmMethod = (stateValue, conditions, operator) => {
  // check(stateValue, String);
  // check(conditions, [Object]);

  let alarmMethod = 'note';
  const maxCond = conditions.length;

  // First condition matched, first method applied
  for (let i = 0; i < maxCond; i++) {
    const {value, method} = conditions[i];
    switch (operator) {
      case 'LessThanOrEqualToThreshold': {
        if (stateValue <= value) {
          alarmMethod = method;
          return {alarmMethod};
        }
      }
      case 'LessThanThreshold': {
        if (stateValue < value) {
          alarmMethod = method;
          return {alarmMethod};
        }
      }
      case 'GreaterThanOrEqualToThreshold': {
        if (stateValue >= value) {
          alarmMethod = method;
          return {alarmMethod};
        }
      }
      case 'GreaterThanThreshold':
      default: {
        if (stateValue > value) {
          alarmMethod = method;
          return {alarmMethod};
        }
      }
    }
  }

  return {alarmMethod};
};

const getContactsInfo = (contacts) => {
  let contactsInfo = [];

  if (!_.isEmpty(contacts)) {
    const {Accounts} = require('meteor/accounts-base');

    const contactsInfo = Accounts.users
      .find(
        {_id: {$in: contacts}},
        {fields: {profile: true, "services.google.email": true}})
      .fetch();

    if (!_.isEmpty(contactsInfo)) {
      return {
        contactsInfo: contactsInfo.map(c => ({
          name: c.profile.name,
          email: c.services.google.email,
          phone: c.profile.phone
        }))
      };
    }
  }

  return {contactsInfo};
};

const notifyBySMS = (content) => {
  try {
    const
      request = require('request'),
      {url, auth, json} = Meteor.settings.sms,
      {subject, detail, timestamp, contacts} = content,
      {contactsInfo} = getContactsInfo(contacts),
      contactsPhone = contactsInfo.map(c => (c.phone)),
      requestParams = {
        url, auth, json,
        body: {
          to: contactsPhone,
          type: 'text/outgoing-sms',
          body: `${subject}\n${detail}\n${moment(timestamp).format()}`
        }
      };

    contactsPhone.forEach(phone => {
      /* Send SMS with Brand name of MOBIVI - very expensive */
      requestParams.body.to = phone;
      const result = request.post(requestParams);
      console.log('send sms', result);
    });
  } catch (err) {
    console.log('notifyBySMS', err.message);
  }
};

const notifyByEmail = (content) => {
  try {
    const
      {Email} = require('meteor/email'),
      {buildEmailHTML} = require('/imports/api/email'),
      {name: siteName, url: siteUrl, slogan} = Meteor.settings.public,
      {subject, name: alarmName, state, stateValue, stateUnit, detail, timestamp, contacts} = content,
      {metric} = parseAlarmName(alarmName),
      data = {
        subject,
        color: state === 'ALARM' ? '#E7505A' : '#2f373e',
        siteUrl,
        siteName,
        alarmName,
        slogan,
        metric,
        state,
        stateValue,
        stateUnit,
        detail,
        timestamp
      },
      {contactsInfo} = getContactsInfo(contacts),
      ccEmails = contactsInfo.map(c => c.email) || []
    ;

    const
      {name: senderName, email: senderEmail} = Meteor.settings.mail.sender,
      from = `"${senderName}" <${senderEmail}>`,
      to = 'icare.bots@icarebenefits.com',
      cc = ccEmails,
      html = buildEmailHTML('notification', data);

    /* Notify by email */
    Email.send({subject, from, to, cc, html});

  } catch (err) {
    console.log('notifyByEmail', err.message);
  }
};

const notifyBySlack = (content) => {
  try {
    const
      Slack = require('slack-node'),
      {webhookUri, username} = Meteor.settings.slack,
      slack = new Slack(),
      {subject, name, state, stateValue, stateUnit, timestamp, noteGroup} = content,
      {metric} = parseAlarmName(name);

    slack.setWebhook(webhookUri);

    slack.webhook({
      channel: `#${noteGroup}`,
      username,
      text: `>>> *${subject}* \n *Name*: ${name} \n *State*: ${state} \n *${metric}*: ${stateValue} \n <!here>: ${moment(timestamp).format()}`
    }, (err) => {
      if (err) {
        console.log('notify to Slack', err.reason);
      }
    });

  } catch (err) {
    console.log('notifyBySlack', err.message);
  }
};

const notifyByMethod = (method, content) => {
  try {
    switch (method) {
      case 'sms': {
        notifyBySMS(content);
        break;
      }
      case 'email': {
        notifyByEmail(content);
        break;
      }
      // always notify to Slack
      case 'note':
      default: {
      }
    }
    notifyBySlack(content);
  } catch (err) {
    throw new Meteor.Error(`BOTS_NOTIFY_BY_METHOD.${method}`, err.message);
  }
};

const Bots = {
  fistSLACheck,
  checkSLA,
  executeSLA,
  addWorkplaceSuggester,
  processAlarmData,
  getAlarmMethod,
  notifyByMethod
};

/* Test checking SLA */
// checkSLA('aKZ46h83jhBao7FEb');

export default Bots