import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
// pages
import {WorkplacesPage, SLAsPage} from '/imports/ui/pages';

const Setup = (props) => (
  props.activeTab === 'sla' ?
    <SLAsPage /> :
    <WorkplacesPage />
)

Setup.propTypes = {
  activeTab: PropTypes.string.isRequired
};

const mapStateToProps = state => ({activeTab: state.pageControl.activeTab});

export default connect(mapStateToProps)(Setup)