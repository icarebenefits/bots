import {Meteor} from 'meteor/meteor';
import React from 'react';
import {FlowRouter} from 'meteor/kadira:flow-router';
import {mount} from 'react-mounter';
import {Session} from 'meteor/session';
import {Accounts} from 'meteor/accounts-base';

/* Layout */
import {MainLayout} from '../../ui/layouts';
/* Pages */
import {
  HomePage,
  SetupPage,
  AccessListPage,
  ErrorPage,
} from '../../ui/pages';

/* Notify */
import * as Notify from '/imports/api/notifications';
/* Methods */
import {Methods} from '/imports/api/collections/logger';

/* Triggers */
import {
  ensureSignedIn,
  ensureIsAdmin,
  initiatePage,
  resetPage
} from './triggers';

/* Trackers */
import './trackers';

/* Redirect afterLogin */
Accounts.onLogin(() => {
  // logout other clients
  // Meteor.logoutOtherClients();
  Methods.create.call({name: 'user', action: 'login', status: 'success', createdBy: Meteor.userId()});
  Session.set('loggedIn', true);
  Notify.info({title: 'Welcome to iCare Bots!'});

  const redirect = Session.get('redirectAfterLogin');
  if (redirect) {
    FlowRouter.go(redirect);
  }
});

/* Redirect afterLogout */
Accounts.onLogout(() => {
  Methods.create.call({name: 'user', action: 'logout', status: 'success', createdBy: Meteor.userId()});
  Session.set('redirectAfterLogin', FlowRouter.path('home'));
  Session.set('loggedIn', false);
  Notify.warning({title: 'See you next time!'});
  FlowRouter.go('home');
});

/* Global trigger */
FlowRouter.triggers.enter([initiatePage]);
FlowRouter.triggers.exit([resetPage]);

FlowRouter.notFound = {
  action() {
    mount(MainLayout, {
      content() {
        return <ErrorPage/>;
      }
    });
  }
};

const publicRoutes = FlowRouter.group({
  name: 'publicRoutes',
});

publicRoutes.route('/', {
  name: 'home',
  action() {
    mount(MainLayout, {
      content() {
        return (
          <HomePage />
        );
      }
    });
  }
});

const userRoutes = FlowRouter.group({
  name: 'userRoutes',
  prefix: '/app',
  triggersEnter: [ensureSignedIn]
});

userRoutes.route('/:page/:country', {
  name: 'setup',
  action() {
    mount(MainLayout, {
      content() {
        return <SetupPage />;
      }
    });
  }
});

const adminRoutes = FlowRouter.group({
  prefix: '/admin',
  triggersEnter: [ensureSignedIn, ensureIsAdmin]
});

adminRoutes.route('/access-list', {
  name: 'access-list',
  action() {
    mount(MainLayout, {
      slogan: 'administration',
      content() {
        return (
          <AccessListPage />
        );
      }
    });
  }
});