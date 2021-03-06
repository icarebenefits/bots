import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import ListItem from './ListItem';
import {NoContent} from '/imports/ui/components/common';

const List = (props) => {
  const
    {
      noContentLabel = 'content',
      headers = [],
      data = [],
      actions = [],
      moreActions = [],
      onDoubleClick = () => {
      },
      readonly = true
    } = props;

  if (_.isEmpty(data)) {
    return (
      <NoContent
        message={`There is no ${noContentLabel}.`}
      />
    );
  }

  return (
    <table className="table table-hover table-striped">
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
            moreActions={moreActions}
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