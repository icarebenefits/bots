import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

class Search extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchText: props.value || ''
    };

    this._onChange = this._onChange.bind(this);
    this._onKeyUp = this._onKeyUp.bind(this);
  }

  _onChange(event) {
    this.setState({
      searchText: event.target.value
    });
  }

  _onKeyUp(event) {
    const
      {keyCode} = event,
      {searchText} = this.state,
      {handleOnChange} = this.props;
    // if press Enter
    if(keyCode === 13) {
      handleOnChange(searchText);
    }
    // press Backspace or Delete
    if((keyCode === 8 || keyCode === 46) && searchText === '') {
      handleOnChange(searchText);
    }
  }

  render() {
    const {className, placeHolder = "Search ...", focus = true} = this.props;
    const {searchText} = this.state;
    return (
      <div className={classnames(className)}>
        <input
          type="search"
          autoFocus={focus}
          className={classnames("form-control")}
          value={searchText}
          placeholder={placeHolder}
          onChange={this._onChange}
          onKeyUp={this._onKeyUp}
        />
      </div>
    );
  }
}

Search.propTypes = {
  className: PropTypes.string,
  handleOnChange: PropTypes.func
};

export default Search