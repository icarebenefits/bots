import React from 'react';
import {FlowRouter} from 'meteor/kadira:flow-router';
import {mount} from 'react-mounter';

// layouts
import MainLayout from '../../ui/layouts/MainLayout';

// pages
import Discover from '../../ui/pages/Discover';
import Home from '../../ui/pages/Home';
import PreferencesPage from '../../ui/pages/PreferencesPage';
import ConditionBuilderTree from '../../ui/pages/ConditionBuilderTree';

// containers
import SLAsList from '../../ui/containers/slas/SLAsList';

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


FlowRouter.route('/discovery', {
  name: 'Discovery',
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

b2bRoutes.route('/', {
  name: 'b2b-root',
  action() {
    mount(MainLayout, {
      content() {
        return <div>Introduction about B2B bots</div>
      }
    });
  }
});

b2bRoutes.route('/slas', {
  name: 'b2b-slas',
  action() {
    mount(MainLayout, {
      crumbs: [
        {id: 'b2b', href: FlowRouter.path('b2b-root'), title: 'B2B'},
        {id: 'slas', href: FlowRouter.path('b2b-slas'), title: 'SLAs'},
      ],
      activeCrumb: "slas",
      pageHeader: 'All B2B SLAs',
      content() {
        return <SLAsList />
      }
    })
  }
})

b2bRoutes.route('/slas/condition-builder/:action', {
  name: 'condition-builder-tree',
  action(params) {
    mount(MainLayout, {
      crumbs: [
        {id: 'b2b', href: FlowRouter.path('b2b-root'), title: 'B2B'},
        {id: 'slas', href: FlowRouter.path('b2b-slas'), title: 'SLAs'},
        {id: 'condition-builder', href: '#', title: 'Condition builder'},
      ],
      activeCrumb: "condition-builder",
      pageHeader: 'Condition Builder Tree',
      content() {
        return (
          <ConditionBuilderTree />
        );
      }
    })
  }
});

b2bRoutes.route('/condition-builder/expr', {
  name: 'condition-builder-expr',
  action() {
    mount(MainLayout, {
      crumbs: [
        {id: 'b2b', href: '/b2b', title: 'B2B'},
        {id: 'condition-builder', href: '/b2b/condition-builder', title: 'Condition-Builder'},
        {id: 'expr', href: '#', title: 'Expr'},
      ],
      activeCrumb: "expr",
      pageHeader: 'Condition builder expr',
      content() {
        return (
          <ConditionBuilderTree />
        );
      }
    })
  }
});