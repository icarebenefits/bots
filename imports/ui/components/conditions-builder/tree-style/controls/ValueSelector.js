import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import _ from 'lodash';

class ValueSelector extends Component {
  constructor(props) {
    super(props);

    let name = "", label = "";

    if (!_.isEmpty(props.defaultValue)) {
      label = props.defaultValue;
    } else {
      name = props.value;
      const index = props.options.findIndex(option => option.name === name);
      label = props.options[index].label;
    }
    this.state = {
      selected: {
        name,
        label
      }
    };
  }

  _onClickOption(name, label) {
    // console.log(name, label);
    this.setState({
      selected: {
        name,
        label
      }
    });

    this.props.handleOnChange(name);
  }

  render() {
    const
      {options, className} = this.props,
      {selected: {label}} = this.state
      ;

    // console.log({name, label})

    return (
      <div className="dropdown">
        <button className="btn btn-default dropdown-toggle"
                type="button"
                id="dropdownMenu1"
                data-toggle="dropdown" aria-haspopup="true" aria-expanded="true"
        >
          {label} {' '}
          <span className="caret"></span>
        </button>
        <ul
          className={classNames('dropdown-menu', className)}
        >
          {options.map((option, idx) => (
            <li
              key={idx}
            >
              <a
                id={option.name}
                href="#"
                onClick={() => this._onClickOption(option.name, option.label)}
              >{option.label}</a>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

ValueSelector.propTypes = {
  options: PropTypes.array.isRequired,
  value: PropTypes.string,
  className: PropTypes.string,
  handleOnChange: PropTypes.func
};

export default ValueSelector