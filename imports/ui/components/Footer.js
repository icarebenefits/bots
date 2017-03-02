import React, {PropTypes} from 'react';

const Footer = (props) => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="pull-left">
          <strong>iCare bots</strong>
        </div>
        <div className="pull-right">
          <strong>Copyright</strong> icarebenefits.com &copy; 2017
        </div>
      </div>
    </footer>
  );
};

Footer.propTypes = {

};

export default Footer