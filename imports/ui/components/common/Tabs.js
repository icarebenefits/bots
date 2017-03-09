import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';
import {FlowRouter} from 'meteor/kadira:flow-router';

export class Tabs extends Component {

  render() {
    const
      {tabs} = this.props,
      active = FlowRouter.getQueryParam('tab') || tabs[0].id
      ;

    return (
      <div className="nav-collapse collapse navbar-collapse navbar-responsive-collapse">
        <ul className="nav navbar-nav">
          {tabs.map(tab => {
            const
              {id, name} = tab,
              country = FlowRouter.getParam('country'),
              isActive = active === id ? true : false
              ;
            return (
              // "active open selected"
              <li
                className={classNames({
                     'active': isActive,
                     'selected': isActive,
                     'open': isActive,
                })}
                key={id}
              >
                <a className="text-uppercase"
                   onClick={() => FlowRouter.go('SLAs', {country}, {tab: id})}
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
}

Tabs.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
    })
  ).isRequired,
  active: PropTypes.string,
};

export default Tabs
