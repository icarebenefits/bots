import React, {PropTypes} from 'react';
import classNames from 'classnames';
import _ from 'lodash';

import {FormInput, Button,} from '/imports/ui/components/elements';

const ListItem = (props) => {
  const
    {_id, row, rowData, actions, moreActions} = props,
    status = rowData.pop().value,
    skipButton = (status === 'inactive' || status === 'draft') ? 'Inactivate' : 'Activate';

    return (
      <tr className="odd gradeX">
        {rowData.map((cell, idx) => {
          const {value} = cell;
          return (
            <td
              key={idx}
              data-row={row}
              data-cell={idx}
            >{value}</td>
          );
        })}
        {!_.isEmpty(actions)
          ? <td>
            <div className="btn-group btn-group-sm">
              {actions.map(action => {
                const {id, icon, label, className, onClick} = action;
                return (
                  label === skipButton ? null :
                    <Button
                      key={id}
                      className={classNames("btn-default", className)}
                      onClick={e => {e.preventDefault(); onClick(id, _id)}}
                    ><i className={icon}/>{' '}{label}</Button>
                );
              })}
              {!_.isEmpty(moreActions) && (
                <div className="btn-group btn-group-sm pull-right">
                  <button
                    className="btn btn-default  btn-outline dropdown-toggle"
                    data-toggle="dropdown">
                    <i className="fa fa-caret-down"/>
                  </button>
                  <ul className="dropdown-menu pull-right">
                    {moreActions.map(action => {
                      const {id, icon, label, onClick} = action;
                      return (
                        <li key={id}>
                          <a onClick={e => {e.preventDefault(); onClick(id, _id)}}>
                            <i className={icon}/>{label}</a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          </td>
          : null
        }
      </tr>
    );
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