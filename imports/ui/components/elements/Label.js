import React from 'react';
import PropTypes from 'prop-types';

const Label = (props) => {
  const {className, value} = props;
  return (
    <label className={className}>{value}</label>
  );
};

Label.propTypes = {
  className: PropTypes.string,
  value: PropTypes.string,
};

export default Label