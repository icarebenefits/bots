import React, {PropTypes} from 'react';
import classNames from 'classnames';

const Navigation = (props) => {
  const {tabs, activeTab} = props;

  return (
    <ul className={classNames("nav nav-pills", props.classNames)}>
      {tabs.map((tab, idx) => {
        const {id, href, title, active, ...actions} = tab;
        return (
          <li
            role="presentation"
            className={classNames({'active': id === activeTab})}
            key={idx}
            {...actions}
          >
            <a href={href}>{title}</a>
          </li>
        );
      })}
    </ul>
  );
};

Navigation.propsType = {
  tabs: PropTypes.arrayOf(
    PropTypes.objectOf(
      PropTypes.any
    )
  ).isRequired,
  classNames: PropTypes.string,
  activeTab: PropTypes.string
};

export default Navigation