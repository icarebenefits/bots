import React, {Component, PropTypes} from 'react';
import {FlowRouter} from 'meteor/kadira:flow-router';

// Components
// common
import {
  Header,
  Footer
} from '../../ui/components/common';


class MainLayout extends Component {

  render() {
    const {
      tabs = [],
      content = () => {
      }
    } = this.props;

    return (
      <div className="page-header-fixed page-sidebar-closed-hide-logo">
        <div className="wrapper">
          {/* Header */}
          <Header 
            tabs={tabs}
          />

          <div id="index" className="container-fluid">
            <div className="page-content">
              {/* Breadcrumbs */}

              <div className="page-content-container">
                <div className="page-content-row">
                  {/* Page Sidebar */}
                  <div className="page-sidebar">
                  </div>

                  {/* Content */}
                  {content()}
                </div>
              </div>
            </div>

            {/* Footer */}
            <Footer />
          </div>
        </div>
        {/* Quick Sidebar */}
      </div>
    );
  }
}
;

export default MainLayout