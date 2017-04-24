import {Meteor} from 'meteor/meteor';
import _ from 'lodash';

/* Collections */
import {AccessList} from '/imports/api/collections/access-list';

/* Deny all client-side updates to user documents */
Meteor.users.deny({
  update() { return true; }
});

/* Validation for new user */
Accounts.validateNewUser(user => {
  /* only allow login with google service and email address is in access_list */
  const {google} = user.services;
  if(!google) {
    throw new Meteor.Error(403, 'Only accept logging with "Google service"!');
  } else {
    const {email} = google;
    /* verify domain */
    if(!email) {
      throw new Meteor.Error(403, 'Google email not found!!!');
    } else {
      const emailDomain = email.split('@')[1];
      const {domains} = Meteor.settings.access_control;
      if(!domains.includes(emailDomain)) {
        throw new Meteor.Error(403, `Permission denied for domain: "${emailDomain}"!`);
      } else {
        /* verify user access list */
        const isAllowed = Boolean(AccessList.find({email}).count());
        if(!isAllowed) {
          throw new Meteor.Error(403, `Permission denied for email "${email}"!`);
        } else {
          return true;
        }
      }
    }
  }
});

/* Validation for user login */
// will be use for feature: disable user login
// Accounts.validateLoginAttempt();
