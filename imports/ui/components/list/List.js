import React, {PropTypes} from 'react';
import _ from 'lodash';

import {NoContent} from '../common';

const List = (props) => {
  const
    {
      label = 'data',
      headers = [],
      data = [],
      actions = [],
      onDoubleClick = () => {},
      readonly = true
    } = props;

  if(_.isEmpty(data)) {
    return (
      <NoContent
        message={`There is no ${label}.`}
      />
    );
  }

  return (
    <table className="table table-hover">
      <thead>
      <tr>
        {headers.map((header, idx) => (
          <th key={idx}>{header}</th>
        ))}
        {!_.isEmpty(actions) && (<th>Actions</th>)}
      </tr>
      </thead>
      <tbody
        onDoubleClick={e => onDoubleClick(e.target.dataset)}
      >

      </tbody>
    </table>
  );
};

List.propTypes = {};

export default List