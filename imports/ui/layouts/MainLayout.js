import React, {Component} from 'react';
import {Provider} from 'react-redux';
import {Store} from '/imports/ui/store';

/* Components */
import {Header, Footer} from '/imports/ui/components/common';

const MainLayout = (props) => {
  return (
    <Provider store={Store}>
      <div className="page-header-fixed page-sidebar-closed-hide-logo">
        <div className="wrapper">
          {/* Header */}
          <Header />
          <div id="index" className="container-fluid">
            <div className="page-content">
              {/* Breadcrumbs */}

              <div className="page-content-container overflow">
                {/* Content */}
                {props.content()}
              </div>
            </div>

            {/* Footer */}
            <Footer />
          </div>
        </div>
        {/* Quick Sidebar */}
      </div>
    </Provider>
  );
};

export default MainLayout