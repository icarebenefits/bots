import React, {Component, PropTypes} from 'react';
import {FlowRouter} from 'meteor/kadira:flow-router';

// components
import Navigation from '../components/Navigation';
// import Breadcrumbs from '../components/Breadcrumbs';
import Footer from '../components/Footer';

class MainLayout extends Component {

  constructor() {
    super();

    this.state = {
      activeTab: 'home'
    };
  }

  handleTabChange = (tab) => {
    this.setState({activeTab: tab});
  };

  render() {
    const
      {route: {name: routeName}} = FlowRouter.current(),
      tabs = [
        {
          id: 'home',
          href: FlowRouter.path('home'),
          title: 'Discovery',
        },
        {
          id: 'b2b',
          href: FlowRouter.path('condition-builder'),
          title: 'B2B',
        }
      ],
      {
        content = () => {
        }
      } = this.props,
      {activeTab} = this.state
      ;

    return (
      <div className="container">
        {/* .. Navigation .. */}
        <div className="row">
          <Navigation
            tabs={tabs}
            activeTab={activeTab}
            handleOnClick={this.handleTabChange}
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
  }
};

export default MainLayout