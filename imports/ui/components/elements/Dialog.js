import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

// components
import Button from './Button';

export class Dialog extends Component {

  componentDidMount() {
    document.body.classList.add('DialogModelOpen');
  }

  componentWillUnmount() {
    document.body.classList.remove('DialogModelOpen');
  }

  render() {
    const {
      modal, header, onAction,
      children,
      hasCancel, confirmLabel,
      href, openTab,
      className = 'DialogSmall', bodyClass = 'text-center'
    } = this.props;

    return (
      <div className={classNames({'Dialog': true, 'DialogModal': modal})}>
        <div className={classNames({'DialogModalWrap': modal, [`${className}`]: true})}>
          <div className="DialogHeader">{header}</div>
          <div className={classNames("DialogBody", bodyClass)}>{children}</div>
          <div className="DialogFooter">
            {hasCancel
              ? <span
              className="DialogDismiss link"
              onClick={onAction.bind(this, 'dismiss')}
            >Cancel</span>
              : null
            }
            {' '}
            <Button
              href={href}
              target={openTab && "_blank"}
              className="btn-default"
              onClick={onAction.bind(this, hasCancel ? 'confirm' : 'dismiss')}
            >{confirmLabel}</Button>
          </div>
        </div>
      </div>
    );
  }
}

Dialog.propTypes = {
  header: PropTypes.string.isRequired,
  confirmLabel: PropTypes.string,
  modal: PropTypes.bool,
  onAction: PropTypes.func,
  // for further implement
  // onConfirm: PropTypes.func,
  // onDismiss: PropTypes.func,
  // and dismiss when user press esc
  hasCancel: PropTypes.bool,
};

Dialog.defaultProps = {
  confirmLabel: 'ok',
  modal: false,
  onAction: () => {
  },
  hasCancel: true
};

export default Dialog