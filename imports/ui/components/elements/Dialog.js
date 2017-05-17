import React, {Component, PropTypes} from 'react';
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
    const {modal, header, onAction, children, hasCancel, confirmLabel, width = 350, bodyClass = 'text-center'} = this.props;

    return (
      <div className={classNames({'Dialog': true, 'DialogModal': modal})}>
        <div className={classNames({'DialogModalWrap': modal})} style={{width}}>
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
  onAction: () => {},
  hasCancel: true
};

export default Dialog