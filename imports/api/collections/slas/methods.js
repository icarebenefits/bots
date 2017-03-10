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
  validate: null,
  // validate: new SimpleSchema({
  //   name: {
  //     type: String,
  //     unique: true,
  //   },
  //   description: {
  //     type: String,
  //     optional: true,
  //   },
  //   workplace: {
  //     type: String,
  //   },
  //   frequency: {
  //     type: Object,
  //     optional: true,
  //   },
  //   'frequency.first': {
  //     type: Object,
  //     optional: true,
  //   },
  //   'frequency.first.preps': {
  //     type: String,
  //     optional: true,
  //   },
  //   'frequency.first.range': {
  //     type: String,
  //     optional: true,
  //   },
  //   'frequency.first.unit': {
  //     type: String,
  //     optional: true,
  //   },
  //   'frequency.second': {
  //     type: Object,
  //     optional: true,
  //   },
  //   'frequency.second.preps': {
  //     type: String,
  //     optional: true,
  //   },
  //   'frequency.second.range': {
  //     type: String,
  //     optional: true,
  //   },
  //   conditions: {
  //     type: [Object]
  //   },
  //   "conditions.$.not": {
  //     type: Boolean,
  //     optional: true,
  //   },
  //   "conditions.$.openParens": {
  //     type: String,
  //     optional: true,
  //   },
  //   "conditions.$.filter": {
  //     type: String,
  //   },
  //   "conditions.$.operator": {
  //     type: String,
  //   },
  //   "conditions.$.values": {
  //     type: [String]
  //   },
  //   "conditions.$.closeParens": {
  //     type: String,
  //     optional: true,
  //   },
  //   "conditions.$.bitwise": {
  //     type: String,
  //     optional: true,
  //   },
  //   status: {
  //     type: Number,
  //     defaultValue: 0,
  //   },
  //   country: {
  //     type: String,
  //     allowedValues: COUNTRIES
  //   }
  // }).validator(),
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
  validate: null,
  // validate: new SimpleSchema({
  //   ...IDValidator,
  //   name: {
  //     type: String,
  //     unique: true,
  //   },
  //   description: {
  //     type: String,
  //     optional: true,
  //   },
  //   workplace: {
  //     type: String,
  //   },
  //   frequency: {
  //     type: Object,
  //     optional: true,
  //   },
  //   'frequency.first': {
  //     type: Object,
  //     optional: true,
  //   },
  //   'frequency.first.preps': {
  //     type: String,
  //     optional: true,
  //   },
  //   'frequency.first.range': {
  //     type: String,
  //     optional: true,
  //   },
  //   'frequency.first.unit': {
  //     type: String,
  //     optional: true,
  //   },
  //   'frequency.second': {
  //     type: Object,
  //     optional: true,
  //   },
  //   'frequency.second.preps': {
  //     type: String,
  //     optional: true,
  //   },
  //   'frequency.second.range': {
  //     type: String,
  //     optional: true,
  //   },
  //   conditions: {
  //     type: [Object]
  //   },
  //   "conditions.$.not": {
  //     type: Boolean,
  //     optional: true,
  //   },
  //   "conditions.$.openParens": {
  //     type: String,
  //     optional: true,
  //   },
  //   "conditions.$.filter": {
  //     type: String,
  //   },
  //   "conditions.$.operator": {
  //     type: String,
  //   },
  //   "conditions.$.values": {
  //     type: [String]
  //   },
  //   "conditions.$.closeParens": {
  //     type: String,
  //     optional: true,
  //   },
  //   "conditions.$.bitwise": {
  //     type: String,
  //     optional: true,
  //   },
  //   status: {
  //     type: Number,
  //     defaultValue: 0,
  //   },
  //   country: {
  //     type: String,
  //     allowedValues: COUNTRIES
  //   },
  // }).validator(),
  run({_id, name, description, workplace, frequency, conditions, status, country}) {
    const
      selector = {_id},
      modifier = {}
      ;

    !_.isEmpty(name) && (modifier.name = name);
    !_.isEmpty(description) && (modifier.description = description);
    !_.isEmpty(workplace) && (modifier.workplace = workplace);
    !_.isEmpty(frequency) && (modifier.frequency = frequency);
    !_.isEmpty(conditions) && (modifier.conditions = conditions);
    !_.isEmpty(status) && (modifier.status = status);
    !_.isEmpty(country) && (modifier.country = country);

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
