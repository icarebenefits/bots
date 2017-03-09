import React from 'react';

export const SearchBox = (props) => {
  const {onSubmit, placeHolder = 'Search...'} = props;

  return (
    <form className="search" onSubmit={onSubmit}>
      <input type="name" className="form-control" name="query" placeholder={placeHolder} />
      <a className="btn submit md-skip">
        <i className="fa fa-search"></i>
      </a>
    </form>
  );
};