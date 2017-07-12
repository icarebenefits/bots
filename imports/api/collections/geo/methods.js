import {Meteor} from 'meteor/meteor';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {ValidatedMethod} from 'meteor/mdg:validated-method';
import _ from 'lodash';

/* Collections */
import GEO_SLA from './geo';
/* Job server */
// import {startJob, cancelJob, removeJob, createJob} from '/imports/api/jobs';
/* Utils */
// import {getScheduleText} from '/imports/utils';

const Methods = {};

/**
 * Method create a GEO condition
 * @param {String} name - geo sla name
 * @return {String} - Mongo document _id
 */
Methods.create = new ValidatedMethod({
  name: 'geo.create',
  validate: null,
  run({name, description, workplace, frequency, condition, type = 'field_sales'}) {
    try {
      const _id = GEO_SLA.insert({
        name,
        description,
        workplace,
        frequency,
        condition,
        status: 'draft'
      });
      // if (status === 'active') {
      //   const freqText = getScheduleText(frequency);
      //   const jobParams = {
      //     name,
      //     freqText,
      //     info: {method: 'bots.elastic', slaId: _id},
      //     country
      //   };
      //   const createResult = await createJob(jobParams);
      //   return {_id, createResult};
      // }
      return {_id};
    } catch (err) {
      throw new Meteor.Error('GEO_SLA_CREATE', err.message);
    }
  }
});

/**
 * Method update a GEO condition
 * @param {String} name - geo sla name
 * @return {String} - Mongo document _id
 */
Methods.update = new ValidatedMethod({
  name: 'geo.update',
  validate: null,
  run({_id, name, description, workplace, frequency, condition, type = 'field_sales'}) {
    try {
      const result = GEO_SLA.update({_id}, {$set: {
        name,
        description,
        workplace,
        frequency,
        condition,
        status: 'draft'
      }});
      // if (status === 'active') {
      //   const freqText = getScheduleText(frequency);
      //   const jobParams = {
      //     name,
      //     freqText,
      //     info: {method: 'bots.elastic', slaId: _id},
      //     country
      //   };
      //   const createResult = await createJob(jobParams);
      //   return {_id, createResult};
      // }
      return {_id};
    } catch (err) {
      throw new Meteor.Error('GEO_SLA_UPDATE', err.message);
    }
  }
});


/**
 * Method get a GEO SLA by name
 * @param {String} name - geo sla name
 * @return {String} - Mongo document _id
 */
Methods.getByName = new ValidatedMethod({
  name: 'geo.getByName',
  validate: new SimpleSchema({
    name: {
      type: String
    }
  }).validator(),
  run({name}) {
    try {
      const geoSLA = GEO_SLA.findOne({name});
      return {...geoSLA};
    } catch (err) {
      throw new Meteor.Error('GEO_SLA_CREATE', err.message);
    }
  }
});

Methods.validateGeoName = new ValidatedMethod({
  name: 'geo.validateGeoName',
  validate: new SimpleSchema({
    name: {
      type: String
    },
    type: {
      type: String
    }
  }).validator(),
  run({name, type}) {
    try {
      const
        {_id} = GEO_SLA.findOne({name, type}, {fields: {_id: true}}),
        isExists = !!_id;

      return {isExists, _id};
    } catch (err) {
      throw new Meteor.Error('validateGeoName', err.reason);
    }
  }
});

export default Methods