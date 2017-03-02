import React, {Component, PropTypes} from 'react';

// components
import FormInput from '../FormInput';
import Dialog from '../Dialog';
import Form from '../Form';
// import Actions from './Actions';

// functions
import {Operators} from '/imports/utils/index';

class ConditionRow extends Component {

  constructor(props) {
    super(props);

    this.state = {
      row: props.id,
      cells: props.cells,
      dialog: null,
      editFilter: null, // if true show form dialog to choose operator and value base on filter data type,
      operators: []
    };
  }

  getData() {
    return this.state.cells;
  }

  _createFormFields(operator) {
  }

  _onChangeData(row, key) {
    if (key === 'filter') {
      const value = this.refs[key].getValue();
      let operators = [];

      if(!_.isEmpty(value)) {
        operators = Operators.get(value);
      }

      this.setState({
        dialog: true,
        editFilter: {row, key},
        operators
      });
    }
    const newCells = this.state.cells;
    newCells[row].value = this.refs[key].getValue();
    this.setState({
      cells: newCells
    });
  }

  _saveDataDialog(action) {
    if (action === 'dismiss') {
      this._closeDialog();
      return;
    }

    const newCells = this.state.cells;
    const {editFilter: {row, key}} = this.state;

    const {operator, value} = this.refs.form.getData();
    const index = newCells.findIndex(x => x.id === "description");
    newCells[index].operator = operator;
    newCells[index].value = value;

    this.setState({
      dialog: null,
      cells: newCells
    });
  }

  _renderFormDialog(readonly) {
    const {dialog, operators} = this.state,
      fields = [
        {
          id: 'operator',
          type: 'select',
          label: '',
          options: operators
        },
        {
          id: 'value',
          type: 'input',
          label: '',
        }
      ];

    if (!dialog) {
      return null;
    }

    const
      {editFilter: {row, key}, error} = this.state,
      header = this.refs[key].getValue()
      ;
    return (
      <Dialog
        modal={true}
        header={readonly ? 'Error' : header}
        confirmLabel={readonly ? ' Ok': 'Save'}
        hasCancel={!readonly}
        onAction={this._saveDataDialog.bind(this)}
      >
        {readonly
          ? {error}
          : <Form
              ref="form"
              fields={fields}
              onSubmit={this._saveDataDialog.bind(this)}
            />
        }
      </Dialog>
    );
  }

  _closeDialog() {
    this.setState({
      dialog: null
    });
  }

  render() {
    const
      {id} = this.props,
      {cells, dialog} = this.state
      ;
    return (
      <tr>
        {cells.map((cell, idx) => {
          cell.defaultValue = cell.value;
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
        {dialog && (
          <td>
            {this._renderFormDialog()}
          </td>
        )}
      </tr>
    );
  }
}

ConditionRow.propTypes = {
  id: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired,
  className: PropTypes.string,
  cells: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
      ]),
      label: PropTypes.string,
      type: PropTypes.string,
      options: PropTypes.arrayOf(
        PropTypes.string
      ),
      sample: PropTypes.any
    })
  )
};

export default ConditionRow