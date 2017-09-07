import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {Session} from 'meteor/session';
import {FlowRouter} from 'meteor/kadira:flow-router';
import {connect} from 'react-redux';
import _ from 'lodash';

const Tabs = (props) => {
  const {tabs, showTabs} = props;
  if(_.isEmpty(tabs)) {
    return null;
  } else {
    const {country} = props;
    const activeTab = _.isEmpty(props.activeTab) ? tabs[0].id : props.activeTab;
    return (
      <div className={classNames({
      "nav-collapse collapse navbar-collapse navbar-responsive-collapse": true,
      "in": showTabs
      })}>
        <ul className="nav navbar-nav">
          {tabs.map(tab => {
            const {id, name} = tab;
            const isActive = activeTab === id;

            // only show api tab for super-admin users
            if(id === 'api' && !Session.get('isSuperAdmin'))
              return null;

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
  const
    isSuperAdmin = Session.get('isSuperAdmin'),
    {pageControl: {tabs, showTabs, activeTab, country}} = state;

  return {
    country,
    tabs,
    showTabs,
    activeTab
  };
};

export default connect(mapStateToProps)(Tabs)
