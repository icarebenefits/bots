import React, {PropTypes} from 'react';
import classNames from 'classnames';

import Button from './Button';

const FormActions = (props) => {
  const {buttons, position} = props;

  return (
    <div className="form-actions">
      <div className="row">
        <div className={position}>
          {buttons.map(btn => {
            const {id, label, className, type, href, handleOnClick} = btn;
            return (
                <Button
                  key={id}
                  id={id}
                  className={classNames('btn', className)}
                  type={type}
                  href={href}
                  onClick={e => handleOnClick(e, id)}
                >{label}</Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

FormActions.propTypes = {
  buttons: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      label: PropTypes.string,
      className: PropTypes.string,
      type: PropTypes.oneOf(['submit', 'button', 'link']),
      href: PropTypes.string,
      handleOnClick: PropTypes.func,
    })
  ).isRequired,
  position: PropTypes.string,
};

export default FormActions