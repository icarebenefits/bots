import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';

import Actions from './Actions';

class Table extends Component {

  _actionClick(rowIdx, action) {
    this.props.handleOnClick(rowIdx, action);
    // console.log(rowIdx, action);
  }

  render() {
    const {headers, data, className, hasActions = false} = this.props;
    return (
      <table className={classNames("table", className)}>
        <thead>
        <tr>
          {headers.map(head => {
            const {id, label} = head;
            return (<th key={id}>{label}</th>);
          })}
          {hasActions && (<th>Actions</th>)}
        </tr>
        </thead>
        <tbody>
        {data.map((row, rowIdx) => {
          return (
            <tr key={rowIdx}>
              {row.map((cell, cellIdx) => {
                return (
                  <td key={cellIdx}>{cell}</td>
                );
              })}
              {hasActions && (
                <td className="ExcelDataCenter">
                  <Actions onAction={this._actionClick.bind(this, rowIdx)}/>
                </td>)}
            </tr>
          );
        })}
        </tbody>
      </table>
    );
  }
}

Table.propTypes = {

};

export default Table