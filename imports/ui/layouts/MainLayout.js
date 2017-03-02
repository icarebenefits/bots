import React, {PropTypes} from 'react';
import {FlowRouter} from 'meteor/kadira:flow-router';

// components
import Navigation from '../components/Navigation';
// import Breadcrumbs from '../components/Breadcrumbs';
import Footer from '../components/Footer';

const MainLayout = (props) => {
  const
    {route: {name: routeName}} = FlowRouter.current(),
    tabs = [
      {
        id: 'home',
        href: FlowRouter.path('home'),
        title: 'Discovery',
      },
      {
        id: 'slas',
        href: FlowRouter.path('preferences'),
        title: 'Preferences',
      }
    ],
    {
      content = () => {
      }
    } = props,
    activeTab = 'home'
    ;

  return (
    <div className="container">
      {/* .. Navigation .. */}
      <div className="row">
        <Navigation
          tabs={tabs}
          activeTab={activeTab}
        />
      </div>

      {/* .. Breadcrumbs .. */}

      {/* .. Content .. */}
      <div className="row">
        {content()}
      </div>

      {/* .. Footer .. */}
    </div>
  );
};

export default MainLayout