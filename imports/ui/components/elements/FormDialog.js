import React, {Component, PropTypes} from 'react';

import {
  FormInput,
} from './';

class FormDialog extends Component {
  render() {
    const {data = []} = this.props;

    return (
      <div className="form-body">
        {data.map((group, idx) => {
          const {ref, type, value, options, handleOnChange} = group;
          return (
            <div className="form-group" key={idx}>
              <FormInput
                ref={ref}
                type={type}
                value={value}
                options={options}
                handleOnChange={value => handleOnChange(ref, value)}
              />
            </div>
          );
        })}
      </div>
    );
  }
}

FormDialog.propTypes = {};

export default FormDialog
