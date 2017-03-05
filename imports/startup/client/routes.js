import React from 'react';
import {FlowRouter} from 'meteor/kadira:flow-router';
import {mount} from 'react-mounter';

// layouts
import MainLayout from '../../ui/layouts/MainLayout';

// pages
import Home from '../../ui/pages/Home';
import ConditionBuilderTree from '../../ui/pages/examples/ConditionBuilderTree';
import {ConditionGroup} from '../../ui/components/conditions-builder/netsuite-style/ConditionGroup';

FlowRouter.route('/', {
  name: 'home',
  action() {
    mount(MainLayout, {
      content() {
        return (
          <Home />
        );
      }
    });
  }
});

const examplesRoutes = FlowRouter.group({
  name: 'examples',
  prefix: '/examples'
});

examplesRoutes.route('/conditions-builder/:style', {
  name: 'conditions-builder',
  action(params, queryParams) {
    const {style} = params;
    mount(MainLayout, {
      crumbs: [
        {id: 'examples', href: FlowRouter.path('examples'), title: 'Examples'},
        {id: 'conditions-builder', href: FlowRouter.path('conditions-builder'), title: 'Conditions builder'},
        {id: style, href: '#', title: style},
      ],
      activeCrumb: style,
      pageHeader: style,
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