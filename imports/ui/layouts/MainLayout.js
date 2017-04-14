import React, {Component} from 'react';

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
      },
      slogan
    } = this.props;

    return (
      <div className="page-header-fixed page-sidebar-closed-hide-logo">
        <div className="wrapper">
          {/* Header */}
          <Header
            slogan={slogan}
            tabs={tabs}
          />

          <div id="index" className="container-fluid">
            <div className="page-content">
              {/* Breadcrumbs */}

              <div className="page-content-container">
                {/* Content */}
                {content()}
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

export default MainLayout