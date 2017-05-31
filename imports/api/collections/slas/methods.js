import {Meteor} from 'meteor/meteor';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {IDValidator} from '/imports/utils';
import _ from 'lodash';
import {DDP} from 'meteor/ddp-client'

import SLAs from './slas';
// query builder
import {QueryBuilder} from '/imports/api/query-builder';
// fields
import {Field} from '/imports/api/fields';

/* Job server */
import {startJob, cancelJob, removeJob, createJob, editJob} from '/imports/api/jobs';

import {Facebook} from '/imports/api/facebook-graph';

/* Utils */
import {getScheduleText} from '/imports/utils';

const Methods = {};

/**
 * Method create an SLA
 * @param {String} name - sla name
 * @param {String} expression - sla expression
 * @param {String} countries - sla list of effected of sla
 * @return {String} - Mongo document _id
 */
Methods.create = new ValidatedMethod({
  name: 'sla.create',
  validate: null,
  async run({name, description, workplace, frequency, conditions, message, status, country}) {
    try {
      const _id = SLAs.insert({name, description, workplace, frequency, conditions, message, status, country});
      if (status === 'active') {
        const freqText = getScheduleText(frequency);
        const jobParams = {
          name,
          freqText,
          info: {method: 'bots.elastic', slaId: _id},
          country
        };
        const createResult = await createJob(jobParams);
        return {_id, createResult};
      }
      return {_id};
    } catch (err) {
      throw new Meteor.Error('SLA_CREATE', err.message);
    }
  }
});

/**
 * Method set status an SLA
 * @param {} name - description
 * @return {}
 */
Methods.setStatus = new ValidatedMethod({
  name: 'sla.setStatus',
  validate: new SimpleSchema({
    ...IDValidator,
    status: {
      type: String,
      allowedValues: ['active', 'inactive', 'draft']
    }
  }).validator(),
  run({_id, status}) {
    const
      selector = {_id},
      modifier = {status}
      ;

    try {
      return SLAs.update(selector, {$set: modifier});
    } catch (e) {
      throw new Meteor.Error('slas.setStatus', e.message);
    }
  }
});

/**
 * Activate SLA
 */
Methods.activate = new ValidatedMethod({
  name: 'sla.activate',
  validate: new SimpleSchema({
    ...IDValidator,
    country: {
      type: String
    }
  }).validator(),
  async run({_id, country}) {
    // get SLA info
    const sla = SLAs.findOne({_id});
    if (!_.isEmpty(sla)) {
      try {
        const
          {_id: slaId, name, frequency} = sla,
          freqText = getScheduleText(frequency);
        // start SLA in Job Server
        const result = await startJob({
          name,
          freqText,
          info: {method: 'bots.elastic', slaId},
          country
        });

        if (result) {
          return SLAs.update({_id}, {$set: {status: 'active'}});
        }
      } catch (err) {
        SLAs.update({_id}, {$set: {status: 'draft'}});
        throw new Meteor.Error('SLA.activate', err.message);
      }
    } else {
      throw new Meteor.Error('SLA.activate', 'SLA not found.')
    }
  }
});

/**
 * Inactivate SLA
 */
Methods.inactivate = new ValidatedMethod({
  name: 'sla.inactivate',
  validate: new SimpleSchema({
    ...IDValidator,
    country: {
      type: String
    }
  }).validator(),
  async run({_id, country}) {
    // get SLA info
    const sla = SLAs.findOne({_id});
    if (!_.isEmpty(sla)) {
      try {
        const {name} = sla;
        // cancel SLA in Job Server
        const result = await cancelJob({name, country});

        if (result) {
          return SLAs.update({_id}, {$set: {status: 'inactive'}});
        }
      } catch (err) {
        throw new Meteor.Error('SLA.inactivate', err.message);
      }
    } else {
      throw new Meteor.Error('SLA.inactivate', 'SLA not found.')
    }
  }
});


/**
 * Method set last execution of a SLA
 * @param {} name - description
 * @return {}
 */
Methods.setLastExecutedAt = new ValidatedMethod({
  name: 'sla.setLastExecutedAt',
  validate: new SimpleSchema({
    ...IDValidator,
    lastExecutedAt: {
      type: Date,
    }
  }).validator(),
  run({_id, lastExecutedAt}) {
    const
      selector = {_id},
      modifier = {lastExecutedAt}
      ;

    try {
      const result = SLAs.update(selector, {$set: modifier});
      return result;
    } catch (e) {
      console.log('error', e);
      throw new Meteor.Error('sla.setLastExecutedAt', JSON.stringify(e));
    }
  }
});

/**
 * Method edit a SLA
 * @param {String} _id - description
 * @param {String} name - sla name
 * @param {String} expression - sla expression (email contains 'bot')
 * @param {String} schedule - sla schedule (every 30 seconds)
 * @return {Boolean} - Mongo update status
 */
Methods.edit = new ValidatedMethod({
  name: 'sla.edit',
  validate: null,
  async run({_id, name, description, workplace, frequency, conditions, message, status, country}) {
    try {
      const currentSLA = SLAs.findOne({_id});
      if (_.isEmpty(currentSLA)) {
        throw new Meteor.Error('SLA_EDIT', 'SLA not found.');
      }

      const freqText = getScheduleText(frequency);
      const jobParams = {
        name,
        freqText,
        info: {method: 'bots.elastic', slaId: _id},
        country
      };

      /* Edit sla in Job Server */
      // remove job base on new name
      const {name: currentName} = currentSLA;
      if (currentName.toLowerCase() !== name.toLowerCase()) {
        // job name didn't change
        const removeResult = await removeJob({name: currentName, country});
      } else {
        const removeResult = await removeJob({name, country});
      }
      // create new job if job is activated
      if (status === 'active') {
        const createResult = await createJob(jobParams);
      }

      // edit SLA in Database
      const selector = {_id}, modifier = {};

      !_.isEmpty(name) && (modifier.name = name);
      !_.isEmpty(description) && (modifier.description = description);
      !_.isEmpty(workplace) && (modifier.workplace = workplace);
      !_.isEmpty(frequency) && (modifier.frequency = frequency);
      !_.isEmpty(conditions) && (modifier.conditions = conditions);
      (!_.isEmpty(status) || status === 0) && (modifier.status = status);
      !_.isEmpty(country) && (modifier.country = country);
      !_.isEmpty(message) && (modifier.message = message);

      const result = SLAs.update(selector, {$set: modifier});
      return result;
    } catch (err) {
      throw new Meteor.Error('SLA_EDIT', err.message);
    }
  }
});

/**
 * Method validate name of a SLA
 * @param {String} _id - description
 * @param {String} name - sla name
 * @param {String} country - sla country
 * @return {error} - validate result
 */
Methods.validateName = new ValidatedMethod({
  name: 'sla.validateName',
  validate: new SimpleSchema({
    _id: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
      optional: true
    },
    name: {
      type: String,
    },
    country: {
      type: String,
    }
  }).validator(),
  run({_id, name, country}) {
    try {
      if (_.isEmpty(name)) {
        return {validated: false, detail: ['Name is required.']};
      }
      const sla = SLAs.findOne({name, country}, {fields: {_id: true}});
      if (_.isEmpty(sla)) {
        return {validated: true}; // new name is valid
      } else {
        if (_id && sla._id === _id) {
          return {validated: true}; // name didn't change
        } else {
          return {validated: false, detail: ['Name is exists.']}; // new name is duplicated with other sla
        }
      }
    } catch (err) {
      throw new Meteor.Error('SLA_METHOD_VALIDATE_NAME', err.message);
    }
  }
});

Methods.preview = new ValidatedMethod({
  name: 'sla.preview',
  validate: null,
  run({SLA}) {
    if (!this.isSimulation) {
      try {
        const {executeSLA} = require('/imports/api/bots');
        const result = executeSLA({SLA});
        return result;
      } catch (err) {
        throw new Meteor.Error('PREVIEW_SLA', err.message);
      }
    }
  }
});

Methods.postMessage = new ValidatedMethod({
  name: 'sla.postMessage',
  validate: null,
  async run({workplace, message}) {
    if (!this.isSimulation) {
      try {
        const result = await Facebook().postMessage(workplace, message);
        return result;
      } catch (err) {
        throw new Meteor.Error('POST_MESSAGE_TO_WORKPLACE', err.message);
      }
    }
  }
});

/**
 * Method validate Conditions of a SLA to query Elasticsearch
 * @param {Array} conditions - sla name
 * @return {error} - validate result
 */
Methods.validateConditions = new ValidatedMethod({
  name: 'sla.validateConditions',
  validate: new SimpleSchema({
    conditions: {
      type: [Object],
    },
    "conditions.$.not": {
      type: Boolean,
      optional: true,
    },
    "conditions.$.openParens": {
      type: String,
      optional: true,
    },
    "conditions.$.group": {
      type: String,
      optional: true,
    },
    "conditions.$.filter": {
      type: String,
      optional: true,
    },
    "conditions.$.field": {
      type: String,
      optional: true,
    },
    "conditions.$.operator": {
      type: String,
      optional: true,
    },
    "conditions.$.values": {
      type: [Object],
      optional: true,
    },
    "conditions.$.values.$.type": {
      type: String,
      optional: true,
    },
    "conditions.$.values.$.value": {
      type: String,
      optional: true,
    },
    "conditions.$.closeParens": {
      type: String,
      optional: true,
    },
    "conditions.$.bitwise": {
      type: String,
      optional: true,
    },
    variables: {
      type: [Object],
    },
    "variables.$.summaryType": {
      type: String,
      optional: true,
    },
    "variables.$.group": {
      type: String,
      optional: true,
    },
    "variables.$.field": {
      type: String,
      optional: true,
    },
    "variables.$.name": {
      type: String,
      optional: true,
    },
    country: {
      type: String
    }
  }).validator(),
  run({conditions, variables, country}) {
    if (!this.isSimulation) {
      const name = 'validateConditionsAndMessage';
      const {Elastic} = require('/imports/api/elastic');
      let isValid = true, queries = [];

      variables.map(aggregation => {
        const
          {group, name} = aggregation,
          {type} = Field()[group]().elastic();
        const
          {elastic: {indexPrefix}, public: {env}} = Meteor.settings,
          index = `${indexPrefix}_${country}_${env}`;

        const {error, query: {query}} = QueryBuilder('conditions').build(conditions, aggregation);
        const {error: aggsErr, aggs} = QueryBuilder('aggregation').build(aggregation);

        // console.log('query', JSON.stringify(query))

        if (error || aggsErr) {
          // return {error: {name, message: JSON.stringify(error)}};
          throw new Meteor.Error(name, JSON.stringify(error));
        } else {
          // build the query
          const ESQuery = {
            query,
            aggs,
            size: 0 // just need the result of total and aggregation, no need to fetch ES documents
          };

          queries.push({index, type, ESQuery});

          // validate query before run
          try {
            const {valid} = Elastic.indices.validateQuery({
              index,
              type,
              body: {query}
            });
            if (!valid) {
              throw new Meteor.Error(name, JSON.stringify(query));
              // return {error: {name, message: JSON.stringify(query)}};
            } else {
              isValid = isValid && valid;
            }
          } catch (e) {
            throw new Meteor.Error(name, JSON.stringify(e));
          }
        }
      });

      return {result: {name, isValid}};
    }
  }
});

/**
 * Method remove a SLA
 * @param {} name - description
 * @return {}
 */
Methods.remove = new ValidatedMethod({
  name: 'sla.remove',
  validate: new SimpleSchema({
    ...IDValidator,
    country: {
      type: String
    }
  }).validator(),
  async run({_id, country}) {
    // get SLA info
    const sla = SLAs.findOne({_id});
    if (!_.isEmpty(sla)) {
      try {
        const {name} = sla;
        // remove SLA in Job Server
        const result = await removeJob({name, country});
        if (result) {
          return SLAs.remove({_id});
        }
      } catch (err) {
        throw new Meteor.Error('SLA.remove', err.message);
      }
    } else {
      throw new Meteor.Error('SLA.remove', 'SLA not found.')
    }
  }
});

/**
 * Method publish a SLA to production
 * @param {String} _id
 * @param {String} country
 * @returns {String} publishedURL
 */
Methods.publish = new ValidatedMethod({
  name: 'sla.publish',
  validate: new SimpleSchema({
    ...IDValidator,
    country: {
      type: String
    }
  }).validator(),
  run({_id, country}) {
    let publishedUrl = '';
    // get SLA info
    const sla = SLAs.findOne({_id});
    if (!_.isEmpty(sla)) {
      try {
        // connect to production with DDP protocol
        const {host} = Meteor.settings.public.prod;
        const BotsProd = DDP.connect(`http://${host}`);

        const
          {
            name: originalName, description,
            frequency, conditions, message
          } = sla;
        const
          name = `${originalName}_published`,
          workplace = '',
          status = 'draft';

        // validate name for published SLA
        BotsProd.call('sla.validateName', {name, country}, (err, res) => {
          if (err)
            throw new Meteor.Error('VALIDATE_NAME_IN_PROD', err.reason);
          const {validated, detail} = res;
          if (!validated) {
            throw new Meteor.Error('VALIDATE_NAME_IN_PROD', detail[0]);
          } else {
            // publish SLA to production
            BotsProd.call('sla.create', {
              name, description, workplace,
              frequency, conditions, message,
              status, country
            }, (err, res) => {
              if (err)
                throw new Meteor.Error('CREATE_SLA_IN_PROD', err.reason);

              const {_id} = res;
              // return the published SLA URL
              console.log('host', host);
              publishedUrl = `http://${host}/app/setup/${country}?tab=sla&mode=edit&id=${_id}`;

              // disconnect from production
              DDP.disconnect();

              return {publishedUrl};
            });
          }
        });
      } catch (err) {
        throw new Meteor.Error('SLA.remove', err.message);
      }
    } else {
      throw new Meteor.Error('SLA.remove', 'SLA not found.')
    }
  }
});

export default Methods
