import React from 'react';

const Logo = (props) => (
  <a className="page-logo" href="/">
    <img src="/img/logo.png" alt="Logo"/>
    {' '}
    <span className="caption">
      <span className="caption-subject font-white sbold uppercase">{props.slogan}</span>
    </span>
  </a>
);

export default Logo