import {Meteor} from 'meteor/meteor';
import {Tracker} from 'meteor/tracker';
import {FlowRouter} from 'meteor/kadira:flow-router';
import {Roles} from 'meteor/alanning:roles';

FlowRouter.wait();

console.log('roles', Roles.userIsInRole(Meteor.userId(), 'admin'))
Tracker.autorun(() => {
  /* Tracker for user roles */
  // if the roles subscription is ready, start routing
  // there are specific cases that this reruns, so we also check
  // that FlowRouter hasn't initalized already
  if(Roles.subscription.ready() && !FlowRouter._initialized)
    FlowRouter.initialize();

  /* Tracker for user login */
  if (!Meteor.userId()) {
    if (Session.get('loggedIn')) {
      // get and save the current route
      const route = FlowRouter.current()
      Session.set('redirectAfterLogin', route.path);

      FlowRouter.go(FlowRouter.path('home'));
    }
  } else {
    Session.set('loggedIn', false);
  }

  if(Roles.subscription.ready() && Meteor.userId()) {
    if (Roles.userIsInRole(Meteor.userId(), ['super-admin'])) {
      Session.set('isSuperAdmin', true);
    } else {
      Session.set('isSuperAdmin', false);
    }
  }
});
