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
    type: String,
    allowedValues: ['active', 'inactive'],
    defaultValue: 'inactive',
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