import React, {PropTypes} from 'react';
import {FlowRouter} from 'meteor/kadira:flow-router';

/* CONSTANTS */
import {SIDEBAR} from '../store/constants';

/* Components */
import {PageSideBar} from '../components';
import SingleSLA from './SingleSLA';
import ListSLA from './ListSLA';

const SLA = (props) => {
  const {
    params: {country, page},
    queryParams: {tab, mode = 'list'}
  } = FlowRouter.current();

  const onClickSidebar = mode => {
    FlowRouter.go('setup', {country, page}, {tab, mode});
  };

  return (
    <div className="page-content-row">
      {<PageSideBar
        options={SIDEBAR['sla']}
        active={mode}
        onClick={onClickSidebar}
      />}
      <div className="page-content-col">
        <div className="note note-info">
          <h2>
            <span className="label label-primary uppercase">{`${mode} SLA`}</span>
          </h2>
        </div>
        <div className="row">
          {(!mode || mode === 'list') ?
            <ListSLA /> :
            <SingleSLA mode={mode}/>}
        </div>
      </div>
    </div>
  );
};

SLA.propTypes = {};

export default SLA