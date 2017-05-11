import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

import {slaChangeMode} from '../store/actions';
import {SIDEBAR} from '../store/constants';

/* Components */
import {PageSideBar} from '../components';
import SingleSLA from './SingleSLA';
import ListSLA from './ListSLA';

const SLA = (props) => {
  const {mode, dispatch} = props;
  return (
    <div className="page-content-row">
      {<PageSideBar
        options={SIDEBAR['sla']}
        active={mode}
        onClick={id => dispatch(slaChangeMode(id))}
      />}
      <div className="page-content-col">
        <div className="note note-info">
          <h2>
            <span className="label label-primary uppercase">{`${mode} SLA`}</span>
          </h2>
        </div>
        <div className="row">
          {mode === 'list' ?
            <ListSLA /> :
            <SingleSLA mode={mode}/>}
        </div>
      </div>
    </div>
  );
};

SLA.propTypes = {
  mode: PropTypes.string
};

const mapStateToProps = state => ({
  mode: state.sla.mode
});

export default connect(mapStateToProps)(SLA)