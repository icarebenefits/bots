import React from 'react';
import PropTypes from 'prop-types';

const Note = (props) => {
  const {title = '', message = '', children} = props;

  return (
    <div className="note note-info">
      <h4 className="block">{title}</h4>
      <h5 className="block">{message}
        {children}
      </h5>
    </div>
  );
};

Note.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
  children: PropTypes.element
};

export default Note