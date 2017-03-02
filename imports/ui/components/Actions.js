import React, {PropTypes} from 'react';

import Button from './Button';

const Actions = props =>
  <div className="form-inline">
    <Button
      className="btn-default"
      onClick={props.onAction.bind(null, 'edit')}
    ><span className="glyphicon glyphicon-pencil" /></Button>
    {' '}
    <Button
      className="btn-danger"
      onClick={props.onAction.bind(null, 'delete')}
    ><span className="glyphicon glyphicon-remove" /></Button>
  </div>

Actions.propTypes = {
  onAction: PropTypes.func,
};

Actions.defaultProps = {
  onAction: () => {},
};

export default Actions