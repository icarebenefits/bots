import {Meteor} from 'meteor/meteor';
import {FlowRouter} from 'meteor/kadira:flow-router';
import { Session } from 'meteor/session'

/* Functions */
import {error} from '/imports/api/notifications';

export const ensureSignedIn = (context, redirect) => {
  if(!Meteor.loggingIn() && !Meteor.userId()) {
    const
      notification = {
      closeButton: true,
      title: 'Authentication',
      message: 'Login is required!'
    },
      currentPath = FlowRouter.current().path;

    Session.set("redirectAfterLogin", currentPath);
    error(notification);

    redirect('/');
  }
};

export const ensureIsAdmin = (context, redirect) => {

};