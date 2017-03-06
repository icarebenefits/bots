import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';

class ActionElement extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {icon, label, className, handleOnClick} = this.props;

    return (
      <div>
        <button className={classNames('btn btn-default', className)}
                onClick={e => handleOnClick(e)}
        >
          <span className={classNames(icon)}></span>{` ${label}`}
        </button>
      </div>
    );
  }
}

ActionElement.propTypes = {
  label: PropTypes.string,
  className: PropTypes.string,
  handleOnClick: PropTypes.func,
};

export default ActionElement