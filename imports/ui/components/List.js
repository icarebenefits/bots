import React, {PropTypes} from 'react';
import _ from 'lodash';

import ListItem from './ListItem';
import {NoContent} from './common';

const List = (props) => {
  const
    {
      headers = [],
      data = [],
      actions = [],
      onDoubleClick = () => {},
      readonly = true
    } = props;

  if(_.isEmpty(data)) {
    return (
      <NoContent
        message="There is no SLA."
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
      {data.map((d, rowIdx) => {
        const {_id, row} = d;
        return (
          <ListItem
            key={rowIdx}
            row={rowIdx}
            rowData={row}
            _id={_id}
            readonly={readonly}
            actions={actions}
          />
        );
      })}
      </tbody>
    </table>
  );
};

List.propTypes = {
  headers: PropTypes.arrayOf(
    PropTypes.string
  ),
  data: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      row: PropTypes.arrayOf(
        PropTypes.object
      )
    })
  ).isRequired,
  actions: PropTypes.arrayOf(
    PropTypes.object
  ),
  handleDoubleClick: PropTypes.func,
  readonly: PropTypes.bool,
};

export default List