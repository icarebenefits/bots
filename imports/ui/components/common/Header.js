import React, {Component} from 'react';
import _ from 'lodash';

import {
  Logo,
  Tabs,
} from './';


const Header = (props) => {
  const {tabs = []} = props;
  return (
    <header className="page-header page-top">
      <nav className="navbar mega-menu" role="navigation">
        <div className="container-fluid">
          <div className="clearfix navbar-fixed-top">
            <Logo />
          </div>
          {!_.isEmpty(tabs) && (
            <Tabs
              tabs={tabs}
            />
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header