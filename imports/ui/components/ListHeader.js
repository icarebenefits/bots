import React, {PropTypes} from 'react';

import {Search} from './common';

const ListHeader = (props) => {
  const {} = props;

  return (
    <div className="row">
      <div className="col-md-6 col-sm-6">
        <div className="dataTables_length" id="sample_1_length">
          <label>Show {' '}
            <select name="sample_1_length" aria-controls="sample_1"
                    className="form-control input-sm input-xsmall input-inline">
              <option value="5">5</option>
              <option value="15">15</option>
              <option value="20">20</option>
              <option value="-1">All</option>
            </select>
          </label>
        </div>
      </div>
      <div className="col-md-6 col-sm-6">
        <div className="dataTables_filter pull-right">
          <label>Search: {' '}
            <input type="search" className="form-control input-sm input-small input-inline" placeholder=""
                   aria-controls="sample_1"/>
          </label>
        </div>
      </div>
    </div>
  );
};

ListHeader.propTypes = {

};

export default ListHeader