import React, {Component, PropTypes} from 'react';
import classnames from 'classnames';

class Search extends Component {

  render() {
    const {className, placeHolder = "Search ...", handleOnChange} = this.props;

    return (
      <div className={classnames(className)}>
        <input
          type="search"
          className={classnames("form-control")}
          placeholder={placeHolder}
          onChange={e => handleOnChange(e.target.value)}
        />
      </div>
    );
  }
}

Search.propTypes = {
  className: PropTypes.string,
  handleOnChange: PropTypes.func,
};

export default Search