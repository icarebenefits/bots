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
  Redux,
} from '../../ui/pages';
import ConditionGroup from '../../ui/components/conditions-builder/ConditionsBuilder';
import ScheduleBuilder from '../../ui/components/schedule-builder/ScheduleBuilder';

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
    let slogan = '';
    switch(country) {
      case 'vn': {
        slogan = 'Vietnam';
        break;
      }
      case 'kh': {
        slogan = 'Cambodia';
        break;
      }
      case 'la': {
        slogan = 'Laos';
        break;
      }
      default: {
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
