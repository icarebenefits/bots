import React from 'react';
import PropTypes from 'prop-types';

import Pagination from '../common/Pagination';

const ListFooter = (props) => {
  const {handlePageClick, pageCount, pageSelected} = props;
  return (
    <div className="row">
      <div className="col-md-12 col-sm-12">
        <div className="dataTables_paginate paging_bootstrap_full_number pull-right">
          <Pagination
            handlePageClick={handlePageClick}
            pageCount={pageCount}
            pageSelected={pageSelected}
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