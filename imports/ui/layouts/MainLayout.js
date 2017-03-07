import React, {Component, PropTypes} from 'react';
import {FlowRouter} from 'meteor/kadira:flow-router';

// components
import NavBar from '../components/common/NavBar';
import Navigation from '../components/common/Navigation';
import Breadcrumbs from '../components/common/Breadcrumbs';
import Footer from '../components/common/Footer';

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
          title: 'iCare bots',
        },
        {
          id: 'examples',
          href: FlowRouter.path('conditions-builder', {style: 'netsuite'}),
          title: 'Examples',
        },
        {
          id: 'group',
          href: FlowRouter.path('group'),
          title: 'workplace group',
        }
      ],
      {
        content = () => {
        },
        crumbs = [],
        activeCrumb,
        pageHeader
      } = this.props,
      {activeTab} = this.state
      ;

    return (
      <div className="container">
        {/* .. NavBar .. */}
        <NavBar
          tabs={tabs}
          activeTab={activeTab}
          handleTabChange={this.handleTabChange}
        />

        {/* .. Breadcrumbs .. */}
        {!_.isEmpty(crumbs) && (
          <div className="row">
            <Breadcrumbs
              crumbs={crumbs}
              active={activeCrumb}
            />
          </div>
        )}

        {/* .. Page Header .. */}
        <div className="page-header">
          <h1>{pageHeader}</h1>
        </div>

        {/* .. Content .. */}
        <div className="row">
          {content()}
        </div>

        {/* .. Footer .. */}
      </div>
    );
  }
}
;

export default MainLayout