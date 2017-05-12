import React, {PropTypes} from 'react';

import Pagination from './Pagination';

const ListFooter = (props) => {
  const {label = 'Showing 1 to 5 of 25 records'} = props;
  return (
    <div className="row">
      <div className="col-md-5 col-sm-5">
        <div className="dataTables_info pull-left">
          {label}
        </div>
      </div>
      <div className="col-md-7 col-sm-7">
        <div className="dataTables_paginate paging_bootstrap_full_number pull-right">
          <Pagination />
        </div>
      </div>
    </div>
  );
};

ListFooter.propTypes = {
  label: PropTypes.string,
};

export default ListFooter