import React, {PropTypes} from 'react';
import classNames from 'classnames';

const PageSideBar = (props) => {
  const {options} = props;

  if(_.isEmpty(options)) {
    return (
      <div className="page-sidebar">
      </div>
    );
  } else {
    const {active = options[0].id, onClick} = props;
    return (
      <div className="page-sidebar">
        <nav className="navbar" role="navigation">
          <ul className="nav navbar-nav margin-bottom-35">
            {options.map(option => {
              const {id, icon, label} = option;
              return (
                <li key={id} className={classNames({"active": active === id})}>
                  <a onClick={e => onClick(id)}>
                    <i className={icon}></i>{label}</a>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    );
  }
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