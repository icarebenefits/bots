import React, {PropTypes} from 'react';

import Pagination from '../common/Pagination';

const ListFooter = (props) => {
  const {handlePageClick, pageCount} = props;
  return (
    <div className="row">
      <div className="col-md-12 col-sm-12">
        <div className="dataTables_paginate paging_bootstrap_full_number pull-right">
          <Pagination
            handlePageClick={handlePageClick}
            pageCount={pageCount}
          />
        </div>
      </div>
    </div>
  );
};

ListFooter.propTypes = {
  label: PropTypes.string,
};

export default ListFooter