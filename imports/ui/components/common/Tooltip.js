import React, {PropTypes} from 'react';
import _ from 'lodash';

const Tooltip = (props) => {
  const {title, messages} = props;
  return (
    <div className="note note-success">
      <h4 className="block">{title}</h4>
      {!_.isEmpty(messages) &&
        messages.map((mess, idx) => <p key={idx}>{mess}</p>)}
    </div>
  );
};

Tooltip.propTypes = {
  title: PropTypes.string,
  messages: PropTypes.arrayOf(PropTypes.string)
};

export default Tooltip