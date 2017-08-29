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
    const accessId = AccessList.insert({email});

    /* Send invitation email to user */
    if (accessId) {
      const
        {Email} = require('meteor/email'),
        {Accounts} = require('meteor/accounts-base'),
        {name: siteName, url: siteUrl} = Meteor.settings.public;

      if (Meteor.userId) {
        const invitator = Accounts.users.findOne({_id: Meteor.userId}, {fields: {profile: true}});
        if (!_.isEmpty(invitator)) {
          const
            subject = `${siteName} Invitation Email`,
            {buildEmailHTML} = require('/imports/api/email'),
            {name: senderName, email: senderEmail} = Meteor.settings.mail.sender,
            from = `"${senderName}" <${senderEmail}>`,
            to = email,
            data = {
              siteName,
              siteUrl,
              invitator: invitator.profile.name
            },
            html = buildEmailHTML('invitation', data);

          /* Notify by email */
          Email.send({subject, from, to, html});
        }
      }
    }

    return accessId;
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
