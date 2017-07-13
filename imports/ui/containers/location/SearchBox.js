import React, {Component, PropTypes} from 'react';

class SearchBox extends Component {
  render() {
    const {value = '', onApply} = this.props;
    return (
      <div className="input-group">
        <input
          type="text"
          ref="searchText"
          className="form-control"
          placeholder="Search by email or userId..."
          defaultValue={value}/>
        <span className="input-group-btn">
        <button
          className="btn green uppercase bold"
          type="button"
          onClick={e => {
            e.preventDefault();
            onApply('search', {search: this.refs.searchText.value});
          }}
        >Search</button>
      </span>
      </div>
    );
  }
}

SearchBox.propTypes = {
  value: PropTypes.string,
  onApply: PropTypes.func
};

export default SearchBox