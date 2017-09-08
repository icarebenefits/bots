import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Session} from 'meteor/session';

/* Components */
import Variable from './Variable';

class Summary extends Component {
  render() {
    const
      isSuperAdmin = Session.get('isSuperAdmin'),
      {useBucket = false, bucketGroup, isNestedField = false, variables = [], handlers} = this.props;

    return (
      <table className="table table-striped">
        <thead>
        <tr>
          {useBucket && <th>Bucket</th>}
          <th>Type</th>
          <th>Field</th>
          {isSuperAdmin && <th>API Profile</th>}
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
            isSuperAdmin={isSuperAdmin}
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