import {Meteor} from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import {COUNTRIES} from '/imports/utils/defaults';

class SLAsCollection extends Mongo.Collection {
  insert(doc, callback) {
    // add created and updated Date for document
    doc.createdAt = doc.updatedAt = new Date();
    doc.createdBy = doc.updatedBy = Meteor.userId();
    // add default status of SLA
    // if(!doc.status) {
    //   doc.status = SLAs.status.active;
    // }

    return super.insert(doc, callback);
  }

  update(selector, modifier) {
    // add the updated Date for document
    if(!modifier['$set']) {
      modifier['$set'] = {};
    }
    modifier['$set'].updatedAt = new Date();
    if(Meteor.userId()) {
      modifier['$set'].updatedBy = Meteor.userId();
    }

    return super.update(selector, modifier);
  }
}

// SLA collection
const SLAs = new SLAsCollection('slas');

SLAs.status = {
  active: 'active',
  inactive: 'inactive',
};

SLAs.schema = new SimpleSchema({
  name: {
    type: String,
  },
  description: {
    type: String,
    optional: true,
  },
  workplace: {
    type: String,
  },
  frequency: {
    type: Object,
    optional: true,
  },
  'frequency.preps': {
    type: String,
    optional: true,
  },
  'frequency.range': {
    type: String,
    optional: true,
  },
  'frequency.unit': {
    type: String,
    optional: true,
  },
  'frequency.preps2': {
    type: String,
    optional: true,
  },
  'frequency.range2': {
    type: String,
    optional: true,
  },
  conditions: {
    type: [Object],
    optional: true,
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
  message: {
    type: Object
  },
  "message.variables": {
    type: [Object],
  },
  "message.variables.$.summaryType": {
    type: String,
    optional: true,
  },
  "message.variables.$.group": {
    type: String,
    optional: true,
  },
  "message.variables.$.field": {
    type: String,
    optional: true,
  },
  "message.variables.$.name": {
    type: String,
    optional: true,
  },
  "message.messageTemplate": {
    type: String,
  },
  status: {
    type: String,
    allowedValues: ['draft', 'active', 'inactive'],
    defaultValue: 'draft',
  },
  country: {
    type: String,
    allowedValues: COUNTRIES
  },
  createdAt: {
    type: Date,
  },
  createdBy: {
    type: String,
    optional: true,
  },
  updatedAt: {
    type: Date,
    optional: true,
  },
  updatedBy: {
    type: String,
  },
  lastExecutedAt: {
    type: Date,
    optional: true
  }
});

SLAs.attachSchema(SLAs.schema);

/**
 * Helpers
 * name - return SLA name
 * countries - return an array applied countries of SLA
 * status - return the status of the SLA
 */
SLAs.helpers({
  name() {
    return this.name;
  },
  country() {
    return this.country;
  },
  status() {
    return this.status;
  },
});

export default SLAs