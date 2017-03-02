import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';

class ValueSelector extends Component {
  constructor(props) {
    super(props);

    // console.log(props.options, props.value);

    const
      name = props.value,
      index = props.options.findIndex(option => option.name === name),
      {label} = props.options[index]
    ;

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
      {selected: {name, label}} = this.state
      ;

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
                onClick={e => this._onClickOption(option.name, option.label)}
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