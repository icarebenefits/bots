import React, {Component, PropTypes} from 'react';

/* Components */
import Variable from './Variable';

class Summary extends Component {
  render() {
    const {useBucket = false, bucketGroup, isNestedField = false, variables = [], handlers} = this.props;

    return (
      <table className="table table-striped">
        <thead>
        <tr>
          {useBucket && (<th>Bucket</th>)}
          <th>Type</th>
          <th>Field</th>
          <th>Variable</th>
          <th>Actions</th>
        </tr>
        </thead>
        <tbody>
        {variables.map((variable, idx) => (
          <Variable
            key={idx}
            id={idx}
            bucketGroup={bucketGroup}
            isNestedField={isNestedField}
            useBucket={useBucket}
            variable={variable}
            handlers={handlers}
          />
        ))}
        </tbody>
      </table>
    );
  }
}

Summary.propTypes = {
  useBucket: PropTypes.bool,
  variables: PropTypes.arrayOf(PropTypes.object),
  handlers: PropTypes.object
};

export default Summary