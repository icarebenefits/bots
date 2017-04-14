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
import {Countries} from '/imports/api/collections/countries';
import JobServer from '/imports/api/jobs';
import {Logger} from '/imports/api/logger';

Meteor.startup(function () {
  if (Countries.find().count() === 0) {
    Countries.insert({code: 'vn', name: 'Vietnam', status: 'active'});
    Countries.insert({code: 'kh', name: 'Cambodia', status: 'active'});
    Countries.insert({code: 'la', name: 'Laos', status: 'active'});
  } else {
    /* Create migration data job for every country */
    if(Meteor.settings.elastic.migration.enable) {
      const
        countries = Countries.find()
          .fetch()
          .map(c => c.code),
        {frequency} = Meteor.settings.elastic.migration
        ;

      countries.map(country => {
        JobServer(country).getJobs({name: 'migration'}, (err, res) => {
          if (err) {
            Logger.error({name: 'GET_MIGRATION_JOBS', message: {error: err.reason}});
            throw new Meteor.Error('GET_MIGRATION_JOBS_FAILED', err.reason);
          }
          if (res && _.isEmpty(res)) {
            const params = {
              name: 'migration',
              priority: 'high',
              freqText: frequency[country],
              info: {
                method: 'bots.migrateToElastic',
                country,
              }
            };
            JobServer(country).createJob(params, (err, res) => {
              if (err) {
                Logger.error({name: 'CREATE_MIGRATION_JOBS', message: {error: err.reason}});
                throw new Meteor.Error('CREATE_TEST_JOB_FAILED', err.reason);
              }
              if (res) {
                Logger.info({name: 'CREATE_MIGRATION_JOBS', message: `job run with schedule: ${params.freqText}`});
              }
            });
          } else {
            Logger.info({name: 'MIGRATION_JOBS', message: 'EXISTS'});
          }
        });
      });
    }
  }
});
