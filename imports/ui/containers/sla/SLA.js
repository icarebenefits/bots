import React, {PropTypes} from 'react';
import {FlowRouter} from 'meteor/kadira:flow-router';

/* CONSTANTS */
import {SIDEBAR} from '/imports/ui/store/constants';

/* Components */
import {PageSideBar} from '/imports/ui/components';
import SingleSLA from './SingleSLA';
import ListSLA from './ListSLA';

const SLA = () => {
  const {queryParams: {mode = 'list'}} = FlowRouter.current();

  return (
    <div className="page-content-row">
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