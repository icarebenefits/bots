import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import {COUNTRIES} from '/imports/utils/defaults';

class SLAsCollection extends Mongo.Collection {
  insert(doc, callback) {
    // add created and updated Date for document
    doc.createdAt = doc.updatedAt = new Date();
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
  "conditions.$.group": {
    type: String,
  },
  "conditions.$.filter": {
    type: String,
  },
  "conditions.$.field": {
    type: String,
    optional: true,
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
  message: {
    type: Object
  },
  "message.summaryType": {
    type: String,
  },
  "message.group": {
    type: String,
  },
  "message.field": {
    type: String,
  },
  "message.varName": {
    type: String,
  },
  "message.template": {
    type: String,
  },
  status: {
    type: Number,
    allowedValues: ['draft', 'active', 'paused', 'resumed', 'restarted'],
    defaultValue: 'draft',
  },
  country: {
    type: String,
    allowedValues: COUNTRIES
  },
  createdAt: {
    type: Date,
  },
  updatedAt: {
    type: Date,
  },
  lastExecutedAt: {
    type: Date,
    optional: true
  }
});

// SLAs.attachSchema(SLAs.schema);

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