import React, {PropTypes} from 'react';
import classNames from 'classnames';
import _ from 'lodash';

import {
  FormInput,
  Button,
} from './elements';

const ListItem = (props) => {
  const
    {row, readonly, rowData, actions} = props,
    hasActions = !_.isEmpty(actions)
    ;
  const status = rowData.pop().value;
  const skipButton = (status==='paused'||status=='draft')?'Inactive':'Active';
  console.log(skipButton);
  if (readonly) {
    return (
      <tr className="odd gradeX">
        {rowData.map((cell, idx) => {
          const {id, value} = cell;
          return (
            <td
              key={idx}
              data-row={row}
              data-cell={idx}
            >{value}</td>
          );
        })}
        {hasActions
          ? <td>
            <div className="btn-group">
              {actions.map(action => {
                const {id, icon, label, className, handleAction} = action;
                return (
                  label === skipButton ? null :
                    <Button
                      key={id}
                      className={classNames("btn-default", className)}
                      onClick={e => handleAction(e, id, row)}
                    ><i className={icon}/>{label}</Button>
                );
              })}
            </div>
          </td>
          : null
        }
      </tr>
    );
  } else {
    return (
      <tr>
        {rowData.map((cell, idx) => {
          const
            {type, handleOnChange} = cell;
          return (
            <td
              key={idx}
              data-row={row}
              data-cell={idx}
            >
              <FormInput
                {...cell}
                handleOnChange={value => handleOnChange(row, type, value)}
              />
            </td>
          );
        })}
        {hasActions
          ? <td>
            {actions}
          </td>
          : null
        }
      </tr>
    );
  }
};

ListItem.propTypes = {
  row: PropTypes.number,
  readonly: PropTypes.bool,
  rowData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      type: PropTypes.oneOf(['select', 'checkbox', 'date', 'input']),
      options: PropTypes.arrayOf( // need in case the type is select
        PropTypes.shape({
          name: PropTypes.string,
          label: PropTypes.string,
        })
      ),
      value: PropTypes.any,
      handleOnChange: PropTypes.func,
    })
  ).isRequired,
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      label: PropTypes.string
    })
  )
};

export default ListItem