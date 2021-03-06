import React from 'react';

const Error = () => (
  <div className="page-404-3">
    <div className="container error-404 error-bg" style={{height: 400}}>
      <h1>404</h1>
      <h2>Houston, we have a problem.</h2>
      <p> Actually, the page you are looking for does not exist. </p>
      <p>
        <a href="/" className="btn red btn-outline"> Return home </a>
        <br/></p>
    </div>
  </div>
);

export default Error