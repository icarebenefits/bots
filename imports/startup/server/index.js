import {Meteor} from 'meteor/meteor';
import {Roles} from 'meteor/alanning:roles';
import {Accounts} from 'meteor/accounts-base';

/* Collections */
import {AccessList} from '/imports/api/collections/access-list';
import {Logger as DBLogger} from '/imports/api/collections/logger';

// This defines a starting set of data to be loaded if the app is loaded with an empty db.
import './fixtures.js';

// This defines the route for path on server side
import './routes';

// This file configures the Accounts package to define the UI of the reset password email.
// import '../imports/startup/server/reset-password-email.js';

// Set up some rate limiting and other important security settings.
// import '../imports/startup/server/security.js';
// This defines the access control for user login
import './access-control';

// This defines all the collections, publications and methods that the application provides
// as an API to the client.
// import '../imports/api/api.js';

import _ from 'lodash';
import {Countries} from '/imports/api/collections/countries';
import {getJobs, createJob} from '/imports/api/jobs';
import {Logger} from '/imports/api/logger';
import {formatMessage} from '/imports/utils/defaults';
import {Facebook} from '/imports/api/facebook-graph';

Meteor.startup(function () {
  /* Initiation data for countries */
  if (Countries.find().count() === 0) {
    Countries.insert({code: 'vn', name: 'Vietnam', timezone: 'Asia/Saigon', status: 'active'});
    Countries.insert({code: 'kh', name: 'Cambodia', timezone: 'Asia/Phnom_Penh', status: 'active'});
    Countries.insert({code: 'la', name: 'Laos', timezone: 'Asia/Vientiane', status: 'active'});
  } else {
    /* Create migration data job for every country */
    if (Meteor.settings.elastic.migration.enable) {
      const
        countries = Countries.find()
          .fetch()
          .map(c => c.code),
        {frequency} = Meteor.settings.elastic.migration
        ;

      countries.map(country => {
        const params = {
          name: 'migration',
          priority: 'high',
          freqText: frequency[country],
          info: {
            method: 'bots.migrateToElastic',
            country,
          },
          country
        };
        getJobs({name: params.name, country: params.country})
          .then(jobs => {
            if (_.isEmpty(jobs)) {
              return createJob(params);
            }
            return {};
          })
          .then(res => {
            if(!_.isEmpty(res)) {
              message = formatMessage({message, heading1: 'CREATE_JOB_MIGRATION', code: res});
            }
          })
          .catch(err => {
            message = formatMessage({message, heading1: 'CREATE_JOB_MIGRATION', code: err.message});
          });
      });
    }
  }
  /* Create index suggesters job */
  if (Meteor.settings.elastic.indexSuggests.enable) {
    const {frequency: {workplace: freqText}} = Meteor.settings.elastic.indexSuggests;
    const params = {
      name: 'indexSuggests',
      priority: 'normal',
      freqText,
      info: {
        method: 'bots.indexSuggests',
      },
      country: 'admin'
    };
    let message = '';

    getJobs({name: params.name, country: params.country})
      .then(jobs => {
        if (_.isEmpty(jobs)) {
          return createJob(params);
        }
        return {};
      })
      .then(res => {
        if(!_.isEmpty(res)) {
          message = formatMessage({message, heading1: 'CREATE_JOB_INDEX_SUGGESTS', code: res});
        }
      })
      .catch(err => {
        message = formatMessage({message, heading1: 'CREATE_JOB_INDEX_SUGGESTS', code: err.message});
      });

    if(!_.isEmpty(message)) {
      const {adminWorkplace} = Meteor.settings.facebook;
      Facebook().postMessage(adminWorkplace, message);
    }
  }

  /* Job cleanup indices */
  if (Meteor.settings.admin.cleanup.indices.enable) {
    const {frequency: freqText} = Meteor.settings.admin.cleanup.indices;
    const params = {
      name: 'cleanupIndices',
      priority: 'normal',
      freqText,
      info: {
        method: 'bots.cleanupIndices',
      },
      country: 'admin'
    };
    let message = '';

    getJobs({name: params.name, country: params.country})
      .then(jobs => {
        if (_.isEmpty(jobs)) {
          return createJob(params);
        }
        return {};
      })
      .then(res => {
        if(!_.isEmpty(res)) {
          message = formatMessage({message, heading1: 'CREATE_JOB_CLEANUP_INDICES', code: res});
        }
      })
      .catch(err => {
        message = formatMessage({message, heading1: 'CREATE_JOB_CLEANUP_INDICES', code: err.message});
      });

    if(!_.isEmpty(message)) {
      const {adminWorkplace} = Meteor.settings.facebook;
      Facebook().postMessage(adminWorkplace, message);
    }
  }

  /* Job cleanup indices */
  if (Meteor.settings.admin.cleanup.log.enable) {
    const {frequency: freqText} = Meteor.settings.admin.cleanup.log;
    const params = {
      name: 'cleanupLog',
      priority: 'normal',
      freqText,
      info: {
        method: 'bots.cleanupLog',
      },
      country: 'admin'
    };
    let message = '';

    getJobs({name: params.name, country: params.country})
      .then(jobs => {
        if (_.isEmpty(jobs)) {
          return createJob(params);
        }
        return {};
      })
      .then(res => {
        if(!_.isEmpty(res)) {
          message = formatMessage({message, heading1: 'CREATE_JOB_CLEANUP_LOG', code: res});
        }
      })
      .catch(err => {
        message = formatMessage({message, heading1: 'CREATE_JOB_CLEANUP_LOG', code: err.message});
      });

    if(!_.isEmpty(message)) {
      const {adminWorkplace} = Meteor.settings.facebook;
      Facebook().postMessage(adminWorkplace, message);
    }
  }

  /* Initiation data for administrators */
  const {administrators, role} = Meteor.settings.access_control;
  const currentAdmins = Roles
    .getUsersInRole(role, '', {fields: {_id: true, "services.google.email": true}})
    .fetch()
    .map(({_id, services}) => ({_id, email: services.google.email}));

  administrators.map(email => {
    /* add into access list */
    if (!Boolean(AccessList.find({email}).count())) {
      DBLogger.insert({
        name: 'accessList',
        action: 'grant',
        status: 'success',
        createdBy: 'system',
        details: {email, role}
      });
      AccessList.insert({email});
    }
    /* add into super-admin role */
    if (Boolean(Accounts.users.find({"services.google.email": email}).count())) {
      const {_id} = Accounts.users.findOne({"services.google.email": email});
      DBLogger.insert({name: 'role', action: 'grant', status: 'success', createdBy: 'system', details: {email, role}});
      Roles.addUsersToRoles(_id, role);
    }
  });
  /* remove user from super admin role */
  currentAdmins.map(({_id, email}) => {
    if (!administrators.includes(email)) {
      DBLogger.insert({name: 'role', action: 'revoke', status: 'success', createdBy: 'system', details: {email, role}});
      Roles.removeUsersFromRoles(_id, role);
    }
  });
});
