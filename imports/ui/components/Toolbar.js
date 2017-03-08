import React, {PropTypes} from 'react';

import {Button} from './elements';

const Toolbar = (props) => {
  const {buttons, tools} = props;

  return (
    <div className="table-toolbar">
      {!_.isEmpty(buttons) && (
        <div className="col-md-6">
          <div className="btn-group pull-left">
            {buttons.map(btn => {
              const {id, className, icon, label, handleOnClick} = btn;
              return (
                <Button
                  key={id}
                  id={id}
                  className={className}
                  onClick={e => handleOnClick(e, id)}
                >{label}{' '}<i className={icon}/></Button>
              );
            })}
          </div>
        </div>
      )}
      {!_.isEmpty(tools) && (
        <div className="col-md-6">
          <div className="btn-group pull-right">
            <button className="btn green  btn-outline dropdown-toggle" data-toggle="dropdown">Tools
              <i className="fa fa-angle-down"/>
            </button>
            <ul className="dropdown-menu pull-right">
              {tools.map(tool => {
                const {id, href, icon, label} = tool;
                return (
                  <li key={id}>
                    <a href={href}>
                      <i className={icon} />{label}</a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

Toolbar.propTypes = {
  buttons: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      className: PropTypes.string,
      icon: PropTypes.string,
      label: PropTypes.string,
      handleClick: PropTypes.func,
    })
  ).isRequired,
  tools: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      href: PropTypes.string,
      icon: PropTypes.string,
      label: PropTypes.string,
    })
  ).isRequired,
};

export default Toolbar