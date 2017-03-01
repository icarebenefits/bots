import React from 'react';
import {FlowRouter} from 'meteor/kadira:flow-router';
import {mount} from 'react-mounter';

// layouts
import MainLayout from '../../ui/layouts/MainLayout';

// components
import Discover from '../../ui/pages/Discover';
import PreferencesPage from '../../ui/pages/PreferencesPage';
import B2BPage from '../../ui/pages/B2BPage';

FlowRouter.route('/', {
  name: 'home',
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

FlowRouter.route('/b2b', {
  name: 'b2b',
  action() {
    mount(MainLayout, {
      content() {
        return (
          <B2BPage />
        );
      }
    })
  }
});

FlowRouter.route('/preferences', {
  name: 'preferences',
  action() {
    mount(MainLayout, {
      content() {
        return (
          <PreferencesPage />
        );
      }
    });
  }
});