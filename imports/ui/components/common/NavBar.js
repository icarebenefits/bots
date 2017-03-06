import React, {Component, PropTypes} from 'react';

import Navigation from './Navigation';

class NavBar extends Component {
  
  render() {
    const {tabs, activeTab, handleTabChange} = this.props;
    return (
      <nav className="navbar navbar-default">
        <div className="container-fluid">
          <div className="navbar-header">
            <Navigation
              tabs={tabs}
              activeTab={activeTab}
              handleOnClick={handleTabChange}
            />
          </div>
        </div>
      </nav>
    );
  }
}

NavBar.propTypes = {};

export default NavBar