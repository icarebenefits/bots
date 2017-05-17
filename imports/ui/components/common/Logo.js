import React, {PropTypes} from 'react';
import {connect} from 'react-redux';

const Logo = (props) => (
  <a className="page-logo" href="/">
    <img src="/img/logo.png" alt="Logo"/>
    {' '}
    <span className="caption">
      <span className="caption-subject font-white sbold uppercase">{props.slogan}</span>
    </span>
  </a>
);

Logo.propTypes = {
  slogan: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  slogan: state.pageControl.slogan
});

export default connect(mapStateToProps)(Logo)