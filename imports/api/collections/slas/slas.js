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
  expression: {
    type: Object,
  },
  schedule: {
    type: String,
    optional: true,
  },
  status: {
    type: String,
    allowedValues: ['active', 'inactive'],
    defaultValue: 'inactive',
  },
  countries: {
    type: [String],
    // regEx: [SimpleSchema.RegEx.Id],
    allowedValues: COUNTRIES,
  },
  createdAt: {
    type: Date,
  },
  updatedAt: {
    type: Date,
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
  countries() {
    return this.countries;
  },
  status() {
    return this.status;
  },
});

export default SLAs