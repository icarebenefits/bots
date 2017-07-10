import React, {PropTypes} from 'react';
import classNames from 'classnames';

const PanelSave = (props) => {
  const {visible} = props;
  return (
    <div className={classNames({"tab-pane": true, "active": visible})}>
      <p> Save
      </p>
      <div className="alert alert-warning">
        <p> There is a known issue where the dropdown menu appears to be a clipping if it placed in tabbed content. By far there is no flaxible fix for this issue as per discussion here:
          <a target="_blank"
             href="https://github.com/twitter/bootstrap/issues/3661"> https://github.com/twitter/bootstrap/issues/3661 </a>
        </p>
        <p> But you can check out the below dropdown menu. Don't worry it won't get chopped out by the tab content. Instead it will be opened as dropup menu </p>
      </div>
      <div className="btn-group">
        <a className="btn purple" href="javascript:;" data-toggle="dropdown">
          <i className="fa fa-user"></i> Settings
          <i className="fa fa-angle-down"></i>
        </a>
        <ul className="dropdown-menu bottom-up">
          <li>
            <a href="javascript:;">
              <i className="fa fa-plus"></i> Add </a>
          </li>
          <li>
            <a href="javascript:;">
              <i className="fa fa-trash-o"></i> Edit </a>
          </li>
          <li>
            <a href="javascript:;">
              <i className="fa fa-times"></i> Delete </a>
          </li>
          <li className="divider"> </li>
          <li>
            <a href="javascript:;"> Full Settings </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

PanelSave.propTypes = {};

export default PanelSave