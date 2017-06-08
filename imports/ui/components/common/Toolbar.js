import React, {PropTypes} from 'react';
import _ from 'lodash';

import {Button} from '../elements';
import {Search} from './';

const Toolbar = (props) => {
  const {
    buttons,
    tools, toolLabel,
    searchBox, searchPlaceHolder,
    onFilter,
    searchText, onSearch,
    onClick
  } = props;

  return (
    <div className="table-toolbar">
      {!_.isEmpty(buttons) && (
        <div className="col-md-5 pull-left">
          <div className="btn-group">
            {buttons.map(btn => {
              const {id, className, icon, label} = btn;
              return (
                <Button
                  key={id}
                  id={id}
                  className={className}
                  onClick={e => {e.preventDefault(); onClick(id)}}
                >{label}{' '}<i className={icon}/></Button>
              );
            })}
          </div>
        </div>
      )}
      {searchBox && (
        <div className="col-md-5 pull-right" style={{marginTop: 2, paddingRight: 0}}>
          <Search
            className=""
            value={searchText}
            placeHolder={searchPlaceHolder}
            handleOnChange={onSearch}
          />
        </div>
      )}
      {!_.isEmpty(tools) && (
        <div className="col-md-2" style={{paddingLeft: 0}}>
          <div className="btn-group pull-right">
            <button
              className="btn green  btn-outline dropdown-toggle"
              data-toggle="dropdown">
              {toolLabel}{' '}
              <i className="fa fa-angle-down"/>
            </button>
            <ul className="dropdown-menu pull-right">
              {tools.map(tool => {
                const {id, icon, label} = tool;
                return (
                  <li key={id}>
                    <a onClick={e => {e.preventDefault(); onFilter(id)}}>
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