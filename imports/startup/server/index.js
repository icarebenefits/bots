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

// import later from 'later';
import {later} from 'meteor/mrt:later';
import {Countries} from '/imports/api/collections/countries';

Meteor.startup(function() {
  if(Countries.find().count() === 0) {
    Countries.insert({code: 'vn', name: 'Vietnam', status: 'active'});
    Countries.insert({code: 'kh', name: 'Cambodia', status: 'active'});
    Countries.insert({code: 'la', name: 'Laos', status: 'active'});
  }
});
