import {Mongo} from 'meteor/mongo';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';

class ApiProfileCollection extends Mongo.Collection {
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

const ApiProfile = new ApiProfileCollection('api_profile');

ApiProfile.schema = new SimpleSchema({
  name: {
    type: String,
    max: 50,
    unique: true
  },
  profile: {
    type: String
  },
  endpoint: {
    type: String,
    regEx: SimpleSchema.RegEx.Url
  },
  token: {
    type: String,
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
});

ApiProfile.attachSchema(ApiProfile.schema);

export default  ApiProfile