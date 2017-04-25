import { Mongo } from 'meteor/mongo';

class LoggerCollection extends Mongo.Collection {
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

// Logger collection
const Logger = new LoggerCollection('logger');

export default Logger
