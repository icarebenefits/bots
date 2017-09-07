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
  "conditions.$.value": {
    type: Number
  },
  "conditions.$.method": {
    type: String,
    defaultValue: 'note',
    allowedValues: ['note', 'email', 'sms']
  },
  "noteGroup": {
    type: String,
  },
  contacts: {
    type: [String],
    minCount: 1,
    regEx: SimpleSchema.RegEx.Id
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

// MSLA.insert({name: 'MagentoWebCPU', system: 'magento', service: 'web', metric: 'cpu', conditions: [{value: 25, method: 'sms'}, {value: 24, method: 'email'}, {value: 20, method: 'note'}], noteGroup: 'magento', contacts: ['ZgLZLQcLHC9cs35wQ', 'fBY8rMkoxHPTyhYQN'], status: 'active'});

MSLA.attachSchema(MSLA.schema);

export default MSLA
