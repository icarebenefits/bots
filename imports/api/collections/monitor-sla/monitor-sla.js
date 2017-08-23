import {Mongo} from 'meteor/mongo';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';

class MonitorSLACollection extends Mongo.Collection {
  insert(doc, callback) {
    // add created and updated Date for document
    doc.createdAt = doc.updatedAt = new Date();
    // add created and updated By if user is logged in
    if (this.userId)
      doc.createdBy = doc.updatedBy = this.userId;

    return super.insert(doc, callback);
  }

  update(selector, modifier) {
    // add the updated Date for document
    if (!modifier['$set']) {
      modifier['$set'] = {};
    }
    modifier['$set'].updatedAt = new Date();
    if (this.userId) {
      modifier['$set'].updatedBy = this.userId;
    }

    return super.update(selector, modifier);
  }
}

// SLA collection
const MSLA = new MonitorSLACollection('monitor_sla');

MSLA.schema = new SimpleSchema({
  name: {
    type: String
  },
  description: {
    type: String,
    optional: true
  },
  system: {
    type: String
  },
  service: {
    type: String
  },
  metric: {
    type: String
  },
  conditions: {
    type: [Object],
    minCount: 1,
    maxCount: 5
  },
  "conditions.value": {
    type: Number
  },
  "conditions.method": {
    type: String,
    defaultValue: 'note',
    allowedValues: ['note', 'email', 'sms']
  },
  contacts: {
    type: [String],
    minCount: 1,
    regEx: SimpleSchema.RegEx.Id
  },
  workplaceGroupId: {
    type: String
  },
  messageTemplate: {
    type: String,
    optional: true
  },
  status: {
    type: String,
    defaultValue: 'active',
    allowedValues: ['active', 'disabled'],
    optional: true
  },
  createdAt: {
    type: Date
  },
  createdBy: {
    type: String,
    optional: true
  },
  updatedAt: {
    type: Date,
    optional: true
  },
  updatedBy: {
    type: String,
    optional: true
  },
  lastNotifiedAt: {
    type: Date,
    optional: true
  },
  searchText: {
    type: String,
    optional: true
  }
});

MSLA.attachSchema(MSLA.schema);

export default MSLA
