import { Mongo } from 'meteor/mongo';

class AccessListCollection extends Mongo.Collection {
  insert(doc, callback) {
    // add created and updated Date for document
    doc.createdAt = doc.updatedAt = new Date();
    doc.createdBy = doc.updatedBy = this.userId;
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
    modifier['$set'].updatedBy = this.userId;

    return super.update(selector, modifier);
  }
}

// AccessListComponent collection
const AccessList = new AccessListCollection('access_list');

export default AccessList
