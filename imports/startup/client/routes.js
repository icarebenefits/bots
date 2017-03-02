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

const b2bRoutes = FlowRouter.group({
  name: 'b2b',
  prefix: '/b2b'
});

b2bRoutes.route('/condition-builder/tree', {
  name: 'condition-builder',
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