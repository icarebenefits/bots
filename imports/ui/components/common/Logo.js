import React from 'react';

const Logo = (props) => (
  <a className="page-logo" href="/">
    <img src="/img/logo.png" alt="Logo"/>
    {' '}{props.slogan}
  </a>
);

export default Logo