import React, {PropTypes} from 'react';
import _ from 'lodash';

import ListItem from './ListItem';

const List = (props) => {
  const
    {
      headers = [],
      data = [],
      actions = [],
      handleDoubleClick = () => {},
      readonly = true
    } = props;

  return (
    <table className="table table-hover">
      <thead>
      <tr>
        {headers.map((header, idx) => (
          <th key={idx}>{header}</th>
        ))}
        {!_.isEmpty(actions) && (<td>Actions</td>)}
      </tr>
      </thead>
      <tbody
        onDoubleClick={e => handleDoubleClick(e.target.dataset)}
      >
      {data.map((row, rowIdx) => {
        return (
          <ListItem
            key={rowIdx}
            row={rowIdx}
            rowData={row}
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
    PropTypes.arrayOf(
      PropTypes.object
    )
  ).isRequired,
  actions: PropTypes.arrayOf(
    PropTypes.object
  ),
  handleDoubleClick: PropTypes.func,
  readonly: PropTypes.bool,
};

export default List