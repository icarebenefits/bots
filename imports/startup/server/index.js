import {Meteor} from 'meteor/meteor';
// This defines a starting set of data to be loaded if the app is loaded with an empty db.
import '/imports/startup/server/fixtures.js';

// This defines the route for path on server side
import '/imports/startup/server/routes';

// This file configures the Accounts package to define the UI of the reset password email.
// import '../imports/startup/server/reset-password-email.js';

// Set up some rate limiting and other important security settings.
// import '../imports/startup/server/security.js';

// This defines all the collections, publications and methods that the application provides
// as an API to the client.
// import '../imports/api/api.js';

import _ from 'lodash';
import {later} from 'meteor/mrt:later';
import {Countries} from '/imports/api/collections/countries';
import JobServer from '/imports/api/jobs';

Meteor.startup(function() {
  if(Countries.find().count() === 0) {
    Countries.insert({code: 'vn', name: 'Vietnam', status: 'active'});
    Countries.insert({code: 'kh', name: 'Cambodia', status: 'active'});
    Countries.insert({code: 'la', name: 'Laos', status: 'active'});
  }
  
  // test bots
  // if(Meteor.settings.jobs.test) {
  //   JobServer('kh').getJobs({name: 'bots'}, (err, res) => {
  //     if(err) {
  //       throw new Meteor.Error('GET_TEST_JOBS_FAILED', err.reason);
  //     }
  //     // console.log('GET JOBS', res);
  //     if(res && _.isEmpty(res)) {
  //       const params = {
  //         name: 'bots',
  //         priority: 'normal',
  //         freqText: 'at 3:00 AM every weekday',
  //         info: {
  //           method: 'bots.test'
  //         }
  //       };
  //       JobServer('kh').createJob(params, (err, res) => {
  //         if(err) {
  //           throw new Meteor.Error('CREATE_TEST_JOB_FAILED', err.reason);
  //         }
  //         if(res) {
  //           console.log('CREATED_TEST_JOB', `job run with schedule: ${params.freqText}`);
  //         }
  //       });
  //     } else {
  //       console.log('TEST_JOB_EXISTS');
  //     }
  //   });
  // }
});
