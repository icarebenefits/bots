import React from 'react';
import {FlowRouter} from 'meteor/kadira:flow-router';
import {mount} from 'react-mounter';

// layouts
import MainLayout from '../../ui/layouts/MainLayout';

// components
import Discover from '../../ui/pages/Discover';
import PreferencesPage from '../../ui/pages/PreferencesPage';
import ConditionBuilderTree from '../../ui/pages/ConditionBuilderTree';

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

FlowRouter.route('/b2b/condition-builder/tree', {
  name: 'b2b',
  action() {
    mount(MainLayout, {
      content() {
        return (
          <ConditionBuilderTree />
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