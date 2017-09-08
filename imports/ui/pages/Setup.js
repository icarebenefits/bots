import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Session} from 'meteor/session';
// pages
import {WorkplacesPage, ApiPage, SLAsPage, RFMPage, ErrorPage} from '/imports/ui/pages';

const Setup = (props) => {
  switch (props.activeTab) {
    case 'workplace':
      return <WorkplacesPage />;
    case 'api': {
      if(Session.get('isSuperAdmin')) {
        return <ApiPage />;
      }
      return <ErrorPage/>;
    }
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