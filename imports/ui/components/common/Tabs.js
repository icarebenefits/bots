import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';
import {FlowRouter} from 'meteor/kadira:flow-router';
import {connect} from 'react-redux';

import {setActiveTab} from '/imports/ui/store/actions';

const Tabs = (props) => {
  const {tabs} = props;
  if(_.isEmpty(tabs)) {
    return null;
  } else {
    const {country} = props;
    const activeTab = _.isEmpty(props.activeTab) ? tabs[0].id : props.activeTab;
    return (
      <div className="nav-collapse collapse navbar-collapse navbar-responsive-collapse">
        <ul className="nav navbar-nav">
          {tabs.map(tab => {
            const {id, name} = tab;
            const isActive = activeTab === id;
            return (
              <li
                className={classNames({
                     'active': isActive,
                     'selected': isActive,
                     'open': isActive,
                })}
                key={id}
              >
                <a className="text-uppercase"
                   onClick={() => FlowRouter.go('setup', {page: 'setup', country}, {tab: id})}
                >
                  <i className="fa fa-puzzle"></i>
                  {name}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
};

Tabs.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
    })
  ).isRequired,
  activeTab: PropTypes.string,
};

const mapStateToProps = state => {
  const {pageControl: {tabs, activeTab, country}} = state;
  return {
    country,
    tabs,
    activeTab
  };
};

export default connect(mapStateToProps)(Tabs)
