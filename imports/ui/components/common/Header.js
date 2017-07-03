import React from 'react';
import {connect} from 'react-redux';

import {
  Logo,
  TopBarActions,
  Tabs,
} from './';

import {PAGE_SHOW_TAB} from '/imports/ui/store/constants';
import {toggleNav} from '/imports/ui/store/actions';


const Header = (props) => {
  const {slogan = '', showTabs, onToggleNav} = props;

  const onShowTabs = (e) => {
    e.preventDefault();
    onToggleNav(!showTabs);
  };
  return (
    <header className="page-header page-top">
      <nav className="navbar mega-menu" role="navigation">
        <div className="container-fluid">
          <div className="clearfix navbar-fixed-top">
            <button type="button" className="navbar-toggle" onClick={onShowTabs}>
              <span className="sr-only">Toggle navigation</span>
              <span className="toggle-icon">
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </span>
            </button>
            <Logo slogan={slogan}/>
            <TopBarActions />
          </div>
          <Tabs />
        </div>
      </nav>
    </header>
  );
};

const mapStateToProps = state => {
  const {pageControl: {showTabs}} = state;
  return {
    showTabs
  };
};

const mapDispatchToProps = dispatch => ({
  onToggleNav: t => dispatch(toggleNav(t))
});

export default connect(mapStateToProps, mapDispatchToProps)(Header)