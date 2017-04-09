import React, {PropTypes} from 'react';
import _ from 'lodash';

import {Button} from '../elements';
import {Search} from './';

const Toolbar = (props) => {
  const {buttons, tools, toolLabel, hasSearch, handleOnChange} = props;

  return (
    <div className="table-toolbar">
      {!_.isEmpty(buttons) && (
        <div className="col-md-5">
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
      {hasSearch && (
        <div className="col-md-5" style={{marginTop: 2, paddingRight: 0}}>
          <Search
            className="pull-right"
            handleOnChange={value => handleOnChange('search', value)}
          />
        </div>
      )}
      {!_.isEmpty(tools) && (
        <div className="col-md-2" style={{paddingLeft: 0}}>
          <div className="btn-group pull-right">
            <button
              className="btn green  btn-outline dropdown-toggle"
              data-toggle="dropdown">{toolLabel}
              <i className="fa fa-angle-down"/>
            </button>
            <ul className="dropdown-menu pull-right">
              {tools.map(tool => {
                const {id, icon, label, handleOnChange} = tool;
                return (
                  <li key={id}>
                    <a onClick={e => {e.preventDefault(); handleOnChange(id)}}>
                      <i className={icon}/>{label}</a>
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