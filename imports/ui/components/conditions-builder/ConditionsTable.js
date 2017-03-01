import React, {Component, PropTypes} from 'react';

class ConditionsTable extends Component {
  render() {
    const {headers, conditions} = this.props;

    return (
      <table className="table table-bordered">
        <thead>
        <tr>
          {headers.map((title, idx) => {
            return (
              <td key={idx}>{title}</td>
            );
          })}
        </tr>
        </thead>
        <tbody>
        {conditions.map((condition, rowIdx) => {

          return (
            <tr>
              {cells.map((cell, idx) => {
                // cell.defaultValue = cell.value;
                return (
                  <td
                    key={idx}
                    onChange={this._onChangeData.bind(this, idx, cell.id)}
                  >
                    {cell.id === 'description'
                      ? `${cell.operator} ${cell.value}`
                      : <FormInput ref={cell.id} {...cell} />
                    }
                  </td>
                );
              })}
              <td>
              </td>
              {dialog && (
                <td>
                  {this._renderFormDialog()}
                </td>
              )}
            </tr>
          );
        })}
        </tbody>
      </table>
    );
  }
}

ConditionsTable.propTypes = {

};

export default ConditionsTable