import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {ValidatedMethod} from 'meteor/mdg:validated-method';

/* Collections */
import {Logger} from '/imports/api/collections/logger';

const Methods = {};

/**
 * Method create a log
 */
Methods.create = new ValidatedMethod({
  name: 'logger.create',
  validate: null,
  run({name, action, status, created_by, details}) {
    return Logger.insert({name, action, status, created_by, details});
  }
});

export default Methods
