import {Meteor} from 'meteor/meteor';
import React from 'react';
import {FlowRouter} from 'meteor/kadira:flow-router';
import {mount} from 'react-mounter';
import {Session} from 'meteor/session';
import {Accounts} from 'meteor/accounts-base';
import {Roles} from 'meteor/alanning:roles';

/* Methods */
import {Methods} from '/imports/api/collections/logger';

// layouts
import {
  MainLayout,
  // BlankLayout
} from '../../ui/layouts';

// pages
import {
  CountriesPage,
  WorkplacesPage,
  SLAsPage,

  // Discover,

  ErrorPage,
} from '../../ui/pages';
// triggers
import {
  ensureSignedIn,
  ensureIsAdmin,
} from './triggers';

import './trackers';
// import ConditionGroup from '../../ui/components/conditions-builder/ConditionsBuilder';
// import ScheduleBuilder from '../../ui/components/schedule-builder/ScheduleBuilder';

/* Redirect afterLogin */
Accounts.onLogin(() => {
  // logout other clients
  // Meteor.logoutOtherClients();
  Methods.create.call({name: 'user', action: 'login', status: 'success', created_by: Meteor.userId()});
  Session.set('loggedIn', true);
  
  const redirect = Session.get('redirectAfterLogin');
  if(redirect) {
    FlowRouter.go(redirect);
  }
});

/* Redirect afterLogout */
Accounts.onLogout(() => {
  Methods.create.call({name: 'user', action: 'logout', status: 'success', created_by: Meteor.userId()});
  Session.set('redirectAfterLogin', FlowRouter.path('home'));
  Session.set('loggedIn', false);
  FlowRouter.go('home');
});


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
          <CountriesPage />
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

userRoutes.route('/setup/:country', {
  name: 'SLAs',
  action(params, queryParams) {
    const
      {country} = params,
      {tab} = queryParams
      ;
    let slogan = '';
    switch (country) {
      case 'vn':
      {
        slogan = 'Vietnam';
        break;
      }
      case 'kh':
      {
        slogan = 'Cambodia';
        break;
      }
      case 'la':
      {
        slogan = 'Laos';
        break;
      }
      default:
      {
        slogan = '';
      }
    }

    mount(MainLayout, {
      slogan,
      tabs: [
        {id: 'workplaces', name: 'Workplaces'},
        {id: 'sla', name: 'SLA'},
      ],
      content() {
        switch (tab) {
          case 'workplaces':
          {
            return (
              <WorkplacesPage />
            );
          }
          case 'sla':
          {
            return (
              <SLAsPage />
            );
          }
          default:
          {
            return (
              <WorkplacesPage />
            );
          }
        }
      }
    });
  }
});

const adminRoutes = FlowRouter.group({
  prefix: '/admin',
  triggersEnter: [ensureSignedIn, ensureIsAdmin]
});

/*
const examplesRoutes = FlowRouter.group({
  name: 'examples',
  prefix: '/examples'
});

examplesRoutes.route('/conditions-builder/:style', {
  name: 'conditions-builder',
  action(params) {
    const {style} = params;
    mount(MainLayout, {
      content() {
        switch (style) {
          case 'tree':
          {
            return (
              <ConditionBuilderTree />
            );
          }
          case 'netsuite':
          {
            return (
              <ConditionGroup />
            );
          }
        }
      }
    })
  }
});

examplesRoutes.route('/discovery', {
  name: 'discovery',
  action() {
    mount(MainLayout, {
      content() {
        return (
          <Discover />
        );
      }
    });
  }
});

examplesRoutes.route('/schedule-builder', {
  name: 'schedule-builder',
  action() {
    mount(MainLayout, {
      content() {
        return (
          <ScheduleBuilder
            frequency={{
              preps: 'on the',
              range: 'first',
              unit: 'day of the week',
              preps2: '',
              range2: '',
            }}
          />
        );
      }
    });
  }
});
*/