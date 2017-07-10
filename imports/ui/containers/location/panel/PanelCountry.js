import React, {PropTypes} from 'react';
import classNames from 'classnames';

const PanelCountry = (props) => {
  const {visible} = props;
  return (
    <div className={classNames({"tab-pane": true, "active": visible})}>
      Country
    </div>
  );
};

PanelCountry.propTypes = {};

export default PanelCountry