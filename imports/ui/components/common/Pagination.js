import React from 'react';
import ReactPaginate from 'react-paginate';

const Pagination = (props) => {
  const {handlePageClick, pageCount, pageSelected} = props;
  return (
    <div className="paginate">
      <ReactPaginate
        previousLabel={"previous"}
        nextLabel={"next"}
        breakLabel={<a href="">...</a>}
        breakClassName={"break-me"}
        pageCount={pageCount}
        initialPage={pageSelected}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageClick}
        containerClassName={"pagination"}
        subContainerClassName={"pages pagination"}
        activeClassName={"active"}
      />
    </div>
  );
};

Pagination.propTypes = {};

export default Pagination