import React, {PropTypes} from 'react';
import classNames from 'classnames';

const PanelOpen = (props) => {
  const {visible} = props;
  return (
    <div className={classNames({"tab-pane": true, "active": visible})}>
      Open
    </div>
  );
};

PanelOpen.propTypes = {};

export default PanelOpen