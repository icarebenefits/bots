import React, {Component, PropTypes} from 'react';

class ValuesEditor extends Component {
  constructor(props) {
    super(props);
  }

  getValue() {

  }

  render() {
    const {field, operator, value, handleOnChange} = this.props;
    const exceptionOperators = ['within', 'between'];

    // handle operators has more than 1 value.
    if(exceptionOperators.indexOf(operator) > -1 ) {
      return (
        <div>
            <label htmlFor="">from: </label>
            <input type="text"
                   value={value}
                   onChange={e => handleOnChange(e.target.value)} />

            <label htmlFor="">to: </label>
            <input type="text"
                   value={value}
                   onChange={e => handleOnChange(e.target.value)} />
        </div>

      );
    }

    return (
      <input type="text"
             value={value}
             onChange={e => handleOnChange(e.target.value)} />
    );
  }
}

ValuesEditor.propTypes = {
  field: PropTypes.string,
  operator: PropTypes.string,
  values: PropTypes.array,
  handleOnChange: PropTypes.func,
};

export default ValuesEditor