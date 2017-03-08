/* @flow */
import React from 'react';
import classNames from 'classnames';


const Button = (props) =>
  props.href
    ? <a {...props} className={classNames('btn', props.className)} />
    : <button {...props} className={classNames('btn', props.className)} />
;

export default Button