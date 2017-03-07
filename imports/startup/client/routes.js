import React from 'react';
import {FlowRouter} from 'meteor/kadira:flow-router';
import {mount} from 'react-mounter';

// layouts
import {
  MainLayout,
  BlankLayout
} from '../../ui/layouts';


// pages
import {
  CountriesPage,
  WorkplacesPage,
  SLAsPage,

  BlankPage,

  Discover,
  ConditionBuilderTree,
} from '../../ui/pages';
import {ConditionGroup} from '../../ui/components/conditions-builder/netsuite-style/ConditionGroup';

FlowRouter.route('/', {
  name: 'countries',
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

FlowRouter.route('/setup/:country', {
  name: 'SLAs',
  action(params, queryParams) {
    const 
      {country} = params,
      {tab} = queryParams
      ;
    mount(MainLayout, {
      tabs: [
        {id: 'workplaces', name: 'Workplaces'},
        {id: 'slas', name: 'SLAs'},
      ],
      content() {
        switch(tab) {
          case 'workplaces': {
            return (
              <WorkplacesPage />
            );
          }
          case 'slas': {
            return (
              <SLAsPage />
            );
          }
          default: {
            return (
              <WorkplacesPage />
            );
          }
        }
      }
    });
  }
})

const examplesRoutes = FlowRouter.group({
  name: 'examples',
  prefix: '/examples'
});

examplesRoutes.route('/conditions-builder/:style', {
  name: 'conditions-builder',
  action(params, queryParams) {
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