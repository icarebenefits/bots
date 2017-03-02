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

import later from 'later';
import JobList from '/imports/api/jobs/collections';
import Jobs from '/imports/api/jobs/functions/jobs';
import JobServer from '/imports/api/jobs/functions/job-server';
import Workers from '/imports/api/jobs/functions/workers';

Meteor.startup(function() {
  let type = "";
  
  // startup for B2BJobs
  type = "B2BJobs";
  if (Meteor.settings.jobs.enable[type]) {
    JobServer.start(type);
  }

  if (!JobList[type].find({ type }).count()) {
    let attributes = {};
    if (Meteor.settings.public.env === "dev") {
      console.log(`dev environment`)
      attributes = { priority: "normal", repeat: { schedule: later.parse.text("every 30 seconds") } }
      // attributes = { priority: "normal", repeat: { schedule: later.parse.text(Meteor.settings.jobs.runTime.eNPS) } }
    } else {
      attributes = {
        priority: "normal",
        repeat: { schedule: later.parse.text(Meteor.settings.jobs.runTime[type]) }
      };
    }
    var data = { type };
    Jobs.create(type, attributes, data);
  }

  Jobs.start(type, Workers.checkSLA);
});
