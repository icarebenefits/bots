// @flow
import React, {Component, PropTypes} from 'react';

// components
import FormInput from './FormInput';

class Form extends Component {

  getData() {
    const {fields} = this.props;
    let data = {};

    fields.map(field => data[field.id] = this.refs[field.id].getValue());

    console.log(data);
    return data;
  }

  render() {
    const
      {fields, initialData, readonly} = this.props
    ;

    return (
      <form className="Form">
        {fields.map(field => {
          const preFilled = initialData && initialData[field.id];

          if(!readonly) {
            return (
              <div className="FormRow" key={field.id}>
                <label htmlFor={field.id} className="FormLabel">{field.label}</label>
                <FormInput {...field} ref={field.id} defaultValue={preFilled} />
              </div>
            );
          }
          if(!preFilled) {
            return null;
          }
          return (
            <div className="FormRow" key={field.id}>
              <label htmlFor={field.id} className="FormLabel">{field.label}</label>
              <div>{preFilled}</div>
            </div>
          );
        }, this)}
      </form>
    );
  }
}

Form.propTypes = {
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      label: PropTypes.string,
      options: PropTypes.arrayOf(PropTypes.string)
    })
  ).isRequired,
  initialData: PropTypes.Object,
  readonly: PropTypes.bool
};

export default Form