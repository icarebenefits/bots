import React from 'react';
import FaSpinner from 'react-icons/lib/fa/spinner';

const Spinner = (props) => {
  const
    {
      display = `block`,
      width = `80px`,
      height = `80px`,
      margin = `150px auto`,
      animation = `fa-spin 2s infinite linear`,
    } = props;

  return (
    <FaSpinner
      style={{
        display,
        width,
        height,
        margin,
        animation,
      }}
    />
  );
};

export default Spinner