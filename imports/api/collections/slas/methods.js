import SLAs from './slas';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {ValidationError} from 'meteor/mdg:validation-error';
import {IDValidator} from '/imports/utils';
import {COUNTRIES} from '/imports/utils/defaults';
import _ from 'lodash';

// query builder
import {queryBuilder} from '/imports/api/query-builder';

const Methods = {};

/**
 * Method create an SLA
 * @param {String} name - sla name
 * @param {String} expression - sla expression
 * @param {String} countries - sla list of effected of sla
 * @return {String} - Mongo document _id
 */
Methods.create = new ValidatedMethod({
  name: 'slas.create',
  validate: null,
  run({name, description, workplace, frequency, conditions, message, status, country}) {
    return SLAs.insert({name, description, workplace, frequency, conditions, message, status, country});
  }
});

/**
 * Method set status an SLA
 * @param {} name - description
 * @return {}
 */
Methods.setStatus = new ValidatedMethod({
  name: 'slas.setStatus',
  validate: new SimpleSchema({
    ...IDValidator,
    status: {
      type: String,
    }
  }).validator(),
  run({_id, status}) {
    const
      selector = {_id},
      modifier = {status}
      ;

    return SLAs.update(selector, {$set: modifier});
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
  name: 'slas.edit',
  validate: null,
  run({_id, name, description, workplace, frequency, conditions, message, status, country}) {
    const
      selector = {_id},
      modifier = {}
      ;

    !_.isEmpty(name) && (modifier.name = name);
    !_.isEmpty(description) && (modifier.description = description);
    !_.isEmpty(workplace) && (modifier.workplace = workplace);
    !_.isEmpty(frequency) && (modifier.frequency = frequency);
    !_.isEmpty(conditions) && (modifier.conditions = conditions);
    (!_.isEmpty(status) || status === 0) && (modifier.status = status);
    !_.isEmpty(country) && (modifier.country = country);
    !_.isEmpty(message) && (modifier.message = message);
    return SLAs.update(selector, {$set: modifier});
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
  name: 'slas.validateName',
  validate: new SimpleSchema({
    name: {
      type: String,
    },
    country: {
      type: String,
    }
  }).validator(),
  run({name, country}) {
    if(!this.isSimulation) {
      const sla = SLAs.findOne({name, country});
      if(!_.isEmpty(sla)) {
        return {error: 'SLA name is exists.'}
      } else {
        return {error: null};
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
  name: 'slas.validateConditions',
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
    }
  }).validator(),
  run({conditions}) {
    if(!this.isSimulation) {
      const {Elastic} = require('/imports/api/elastic');
      const {error, query} = queryBuilder(conditions);
      if(error) {
        console.log(error);
      } else {
        // console.log(JSON.stringify(query, null, 2));
        const result = Elastic.indices.validateQuery({body: query});
        const {valid} = result;
        
        console.log('result', result);
        return valid;
      }
    }
  }
});

/**
 * Method remove an SLA
 * @param {} name - description
 * @return {}
 */
Methods.remove = new ValidatedMethod({
  name: 'slas.remove',
  validate: new SimpleSchema({
    ...IDValidator
  }).validator(),
  run({_id}) {
    return SLAs.remove({_id});
  }
});


export default Methods
