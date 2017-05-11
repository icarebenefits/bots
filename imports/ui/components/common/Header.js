import React from 'react';

import {
  Logo,
  TopBarActions,
  Tabs,
} from './';


const Header = (props) => {
  const {slogan = ''} = props;
  return (
    <header className="page-header page-top">
      <nav className="navbar mega-menu" role="navigation">
        <div className="container-fluid">
          <div className="clearfix navbar-fixed-top">
            <Logo slogan={slogan}/>
            <TopBarActions />
          </div>
          <Tabs />
        </div>
      </nav>
    </header>
  );
};

export default Header