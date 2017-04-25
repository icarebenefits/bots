import {Meteor} from 'meteor/meteor';
import _ from 'lodash';

/* Collections */
import {AccessList} from '/imports/api/collections/access-list';
import {Logger} from '/imports/api/collections/logger';

/* Deny all client-side updates to user documents */
Meteor.users.deny({
  update() { return true; }
});

/* Validation for new user */
Accounts.validateNewUser(user => {
  /* only allow login with google service and email address is in access_list */
  const {google} = user.services;
  if(!google) {
    Logger.insert({name: 'user', action: 'create', status: 'failed', created_by: 'validateNewUser', details: {user, reason: 'Only accept logging with "Google service"!'}});
    throw new Meteor.Error(403, 'Only accept logging with "Google service"!');
  } else {
    const {email} = google;
    /* verify domain */
    if(!email) {
      Logger.insert({name: 'user', action: 'create', status: 'failed', created_by: 'validateNewUser', details: {user, reason: 'Google email not found!'}});
      throw new Meteor.Error(403, 'Google email not found!');
    } else {
      const emailDomain = email.split('@')[1];
      const {domains} = Meteor.settings.access_control;
      if(!domains.includes(emailDomain)) {
        Logger.insert({name: 'user', action: 'create', status: 'failed', created_by: 'validateNewUser', details: {user, reason: 'Domain denied'}});
        throw new Meteor.Error(403, `Permission denied for domain: "${emailDomain}"!`);
      } else {
        /* verify user access list */
        const isAllowed = Boolean(AccessList.find({email}).count());
        if(!isAllowed) {
          Logger.insert({name: 'user', action: 'create', status: 'failed', created_by: 'validateNewUser', details: {user, reason: 'Email denied'}});
          throw new Meteor.Error(403, `Permission denied for email "${email}"!`);
        } else {
          Logger.insert({name: 'user', action: 'create', status: 'accepted', created_by: 'validateNewUser', details: user});
          return true;
        }
      }
    }
  }
});

/* Validation for user login */
// will be use for feature: disable user login
// Accounts.validateLoginAttempt();