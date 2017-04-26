import React from 'react';
import _ from 'lodash';

import {
  Logo,
  TopBarActions,
  Tabs,
} from './';


const Header = (props) => {
  const {tabs = [], slogan = ''} = props;
  return (
    <header className="page-header page-top">
      <nav className="navbar mega-menu" role="navigation">
        <div className="container-fluid">
          <div className="clearfix navbar-fixed-top">
            <Logo slogan={slogan}/>
            <TopBarActions />
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