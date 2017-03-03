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
import CreateSLA from '../../ui/containers/slas/CreateSLA';

import {AllElements} from '../../ui/components/netsuite-builder/AllElements';
import {ConditionGroup} from '../../ui/components/netsuite-builder/ConditionGroup';

// containers
import SLAsList from '../../ui/containers/slas/ViewSLAs';

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
  action(params, queryParams) {
    const {action} = params;
    mount(MainLayout, {
      crumbs: [
        {id: 'b2b', href: FlowRouter.path('b2b-root'), title: 'B2B'},
        {id: 'slas', href: FlowRouter.path('b2b-slas'), title: 'SLAs'},
        {id: action, href: '#', title: action},
      ],
      activeCrumb: action,
      pageHeader: `${action} SLA`,
      content() {
        switch (action) {
          case 'view':
          {
            return (
              <ConditionBuilderTree />
            );
          }
          case 'create':
          {
            return (
              <CreateSLA />
            );
          }
        }
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

FlowRouter.route('/condition-builder', {
  name: 'condition-builder',
  action() {
    mount(PreferencesPage);
  }
});

FlowRouter.route('/all-elements', {
  name: 'all-elements',
  action() {
    mount(AllElements);
  }
});

FlowRouter.route('/condition-builder-example', {
  name: 'condition-builder-example',
  action() {
    mount(MainLayout, {
      crumbs: [
        {id: 'b2b', href: '/b2b', title: 'B2B'},
        {id: 'condition-builder', href: '/b2b/condition-builder', title: 'Condition-Builder'},
        {id: 'example', href: '#', title: 'Example'},
      ],
      activeCrumb: "expr",
      pageHeader: 'Condition builder example',
      content() {
        return (
          <ConditionGroup />  
        );
      }
    });
  }
});