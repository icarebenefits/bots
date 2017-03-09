import SLAs from './slas';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {ValidationError} from 'meteor/mdg:validation-error';
import {IDValidator} from '/imports/utils';
import {COUNTRIES} from '/imports/utils/defaults';
import _ from 'lodash';

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
  // validate: null,
  validate: new SimpleSchema({
    name: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
      optional: true,
    },
    workplace: {
      type: String,
    },
    frequency: {
      type: String,
      optional: true,
    },
    conditions: {
      type: [Object]
    },
    "conditions.$.not": {
      type: Boolean,
      optional: true,
    },
    "conditions.$.openParens": {
      type: String,
      optional: true,
    },
    "conditions.$.filter": {
      type: String,
    },
    "conditions.$.operator": {
      type: String,
    },
    "conditions.$.values": {
      type: [String]
    },
    "conditions.$.closeParens": {
      type: String,
      optional: true,
    },
    "conditions.$.bitwise": {
      type: String,
      optional: true,
    },
    status: {
      type: Number,
      defaultValue: 0,
    },
    country: {
      type: String,
      allowedValues: COUNTRIES
    }
  }).validator(),
  run({name, description, workplace, frequency, conditions, status, country}) {
    return SLAs.insert({name, description, workplace, frequency, conditions, status, country});
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
      type: Number,
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
 * Method edit an SLA
 * @param {String} _id - description
 * @param {String} name - sla name
 * @param {String} expression - sla expression (email contains 'bot')
 * @param {String} schedule - sla schedule (every 30 seconds)
 * @return {Boolean} - Mongo update status
 */
Methods.edit = new ValidatedMethod({
  name: 'slas.edit',
  validate: new SimpleSchema({
    ...IDValidator,
    name: {
      type: String,
      optional: true
    },
    expression: {
      type: String,
      optional: true
    },
    schedule: {
      type: String,
      optional: true
    }
  }).validator(),
  run({_id, name, expression, schedule}) {
    const
      selector = {_id},
      modifier = {}
      ;

    if (!name && !expression && !schedule) {
      console.log(`throw error`);
      throw new ValidationError([{
        name: 'modifier',
        type: 'MISSING_MODIFIERS',
        reason: 'Should have 1 field to update.'
      }]);
    }

    !_.isEmpty(name) && (modifier.name = name);
    !_.isEmpty(expression) && (modifier.expression = expression);
    !_.isEmpty(schedule) && (modifier.schedule = schedule);
    console.log(selector, modifier);

    return SLAs.update(selector, {$set: modifier});
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
