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
  validate: new SimpleSchema({
    _id: {
      type: String,
      optional: true
    },
    name: {
      type: String,
    },
    type: {
      type: String,
      allowedValues: ['field_sales'],
      defaultValue: 'field_sales',
      optional: true,
    },
    description: {
      type: String,
      optional: true
    },
    workplace: {
      type: String,
      optional: true
    },
    frequency: {
      type: Object,
      optional: true
    },
    'frequency.preps': {
      type: String,
      optional: true
    },
    'frequency.range': {
      type: String,
      optional: true
    },
    'frequency.unit': {
      type: String,
      optional: true
    },
    'frequency.preps2': {
      type: String,
      optional: true
    },
    'frequency.range2': {
      type: String,
      optional: true
    },
    condition: {
      type: Object,
      optional: true
    },
    "condition.search": {
      type: String,
      optional: true
    },
    "condition.timeRange": {
      type: Object,
      optional: true
    },
    "condition.timeRange.from": {
      type: String,
      optional: true
    },
    "condition.timeRange.to": {
      type: String,
      optional: true
    },
    "condition.timeRange.label": {
      type: String,
      optional: true
    },
    "condition.timeRange.mode": {
      type: String,
      optional: true
    },
    "condition.country": {
      type: String,
      optional: true
    },
    gmap: {
      type: Object,
      optional: true
    },
    "gmap.center": {
      type: Object,
      optional: true
    },
    "gmap.center.lat": {
      type: Number,
      decimal: true,
      optional: true
    },
    "gmap.center.lng": {
      type: Number,
      decimal: true,
      optional: true
    },
    "gmap.zoom": {
      type: Number,
      optional: true
    },
    "gmap.activeMarkerId": {
      type: String,
      optional: true
    },
    "gmap.showPolyline": {
      type: Boolean,
      optional: true
    },
    status: {
      type: String,
      optional: true,
      allowedValues: ['draft', 'active', 'inactive'],
      defaultValue: 'draft'
    },
  }).validator(),
  run({_id, name, description, workplace, frequency, condition, gmap, type = 'field_sales'}) {
    try {
      const geoSLAId = GEO_SLA.insert({
        name,
        description,
        workplace,
        frequency,
        condition,
        gmap,
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
      return {geoSLAId};
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
  validate: new SimpleSchema({
    _id: {
      type: String,
      optional: true
    },
    name: {
      type: String,
    },
    type: {
      type: String,
      allowedValues: ['field_sales'],
      defaultValue: 'field_sales',
      optional: true,
    },
    description: {
      type: String,
      optional: true
    },
    workplace: {
      type: String,
      optional: true
    },
    frequency: {
      type: Object,
      optional: true
    },
    'frequency.preps': {
      type: String,
      optional: true
    },
    'frequency.range': {
      type: String,
      optional: true
    },
    'frequency.unit': {
      type: String,
      optional: true
    },
    'frequency.preps2': {
      type: String,
      optional: true
    },
    'frequency.range2': {
      type: String,
      optional: true
    },
    condition: {
      type: Object,
      optional: true
    },
    "condition.search": {
      type: String,
      optional: true
    },
    "condition.timeRange": {
      type: Object,
      optional: true
    },
    "condition.timeRange.from": {
      type: String,
      optional: true
    },
    "condition.timeRange.to": {
      type: String,
      optional: true
    },
    "condition.timeRange.label": {
      type: String,
      optional: true
    },
    "condition.timeRange.mode": {
      type: String,
      optional: true
    },
    "condition.country": {
      type: String,
      optional: true
    },
    gmap: {
      type: Object,
      optional: true
    },
    "gmap.center": {
      type: Object,
      optional: true
    },
    "gmap.center.lat": {
      type: Number,
      decimal: true,
      optional: true
    },
    "gmap.center.lng": {
      type: Number,
      decimal: true,
      optional: true
    },
    "gmap.zoom": {
      type: Number,
      optional: true
    },
    "gmap.activeMarkerId": {
      type: String,
      optional: true
    },
    "gmap.showPolyline": {
      type: Boolean,
      optional: true
    },
    status: {
      type: String,
      optional: true,
      allowedValues: ['draft', 'active', 'inactive'],
      defaultValue: 'draft'
    },
  }).validator(),
  run({_id, name, description, workplace, frequency, condition, gmap, type = 'field_sales'}) {
    try {
      const result = GEO_SLA.update({_id}, {
        $set: {
          name,
          description,
          workplace,
          frequency,
          condition,
          gmap,
          status: 'draft'
        }
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
      const geoSLA = GEO_SLA.findOne({name, type}, {fields: {_id: true}});
      let isExists = false, _id = null;

      if (geoSLA) {
        isExists = true;
        _id = geoSLA._id;
      }

      return {isExists, _id};
    } catch (err) {
      console.log('validateGeoName.Error', err);
      throw new Meteor.Error('validateGeoName', err.reason);
    }
  }
});

export default Methods