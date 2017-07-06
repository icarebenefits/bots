import React, {PropTypes} from 'react';

const SearchBox = (props) => {
  return (
    <div className="input-group">
      <input type="text" className="form-control" placeholder="Search for... name, email, or userId"/>
      <span className="input-group-btn">
                        <button className="btn blue uppercase bold" type="button">Search</button>
                      </span>
    </div>
  );
};

SearchBox.propTypes = {};

export default SearchBox