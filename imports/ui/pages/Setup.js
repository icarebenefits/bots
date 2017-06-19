import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
// pages
import {WorkplacesPage, SLAsPage, RFMPage} from '/imports/ui/pages';

const Setup = (props) => {
  switch (props.activeTab) {
    case 'workplace':
      return <WorkplacesPage />;
    case 'sla':
      return <SLAsPage />;
    case 'rfm':
      return <RFMPage />;
    default:
      return <WorkplacesPage />;
  }

};

Setup.propTypes = {
  activeTab: PropTypes.string.isRequired
};

const mapStateToProps = state => ({activeTab: state.pageControl.activeTab});

export default connect(mapStateToProps)(Setup)