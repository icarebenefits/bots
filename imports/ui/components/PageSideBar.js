import React, {PropTypes} from 'react';
import classNames from 'classnames';

const PageSideBar = (props) => {
  const {options, active = options[0].id} = props;

  return (
    <div className="page-sidebar">
      <nav className="navbar" role="navigation">
        <ul className="nav navbar-nav margin-bottom-35">
          {options.map(option => {
            const {id, icon, label, handleOnClick} = option;
            return (
              <li key={id} className={classNames({"active": active === id})}>
                <a onClick={e => handleOnClick(e, id)}>
                  <i className={icon}></i>{label}</a>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

PageSideBar.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      icon: PropTypes.string,
      label: PropTypes.string,
      handleOnClick: PropTypes.func,
    })
  ).isRequired,
  active: PropTypes.string,
};

export default PageSideBar