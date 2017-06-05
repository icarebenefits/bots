import { Mongo } from 'meteor/mongo';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';

class CountriesCollection extends Mongo.Collection {
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

// Countries collection
const Countries = new CountriesCollection('countries');

Countries.schema = new SimpleSchema({
  code: {
    type: String,
    unique: true,
  },
  name: {
    type: String,
    optional: true,
  },
  status: {
    type: String,
    allowedValues: ['active', 'inactive'],
    defaultValue: 'active',
    optional: true,
  },
  timezone: {
    type: String,
    optional: true
  },
  createdAt: {
    type: Date,
    optional: true
  },
  updatedAt: {
    type: Date,
    optional: true
  }
});

Countries.attachSchema(Countries.schema);


Countries.helpers({
  name() {
    return this.name;
  },
  code() {
    return this.code;
  },
  status() {
    return this.status;
  },
});

export default Countries
