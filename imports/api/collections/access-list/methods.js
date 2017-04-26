import {Meteor} from 'meteor/meteor';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {IDValidator} from '/imports/utils';

/* Collections */
import {Logger} from '/imports/api/collections/logger';
import {AccessList} from '/imports/api/collections/access-list';

const Methods = {};

/**
 * Method add an email into access list
 */
Methods.create = new ValidatedMethod({
  name: 'access-list.create',
  validate: new SimpleSchema({
    email: {
      type: String,
      regEx: SimpleSchema.RegEx.Email
    },
  }).validator(),
  run({email}) {
    // log user revoked
    Logger.insert({
      name: 'accessList',
      action: 'grant',
      status: 'success',
      createdBy: Meteor.userId(),
      details: {email}
    });

    return AccessList.insert({email});
  }
});

/**
 * Method remove an email from access list
 */
Methods.remove = new ValidatedMethod({
  name: 'access-list.remove',
  validate: new SimpleSchema({
    ...IDValidator,
  }).validator(),
  run({_id}) {
    // log user revoked
    Logger.insert({
      name: 'accessList',
      action: 'revoke',
      status: 'success',
      createdBy: Meteor.userId(),
      details: AccessList.findOne({_id})
    });

    return AccessList.remove({_id});
  }
});

export default Methods
