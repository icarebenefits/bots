import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';

// components
import Actions from './Actions';
import Dialog from './Dialog';
import Form from './Form';
import FormInput from './FormInput';

class Excel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: props.initialData,
      sortBy: null, // schema.id
      descending: false,
      edit: null, // [row index, schema.id]
      dialog: null, // {type, idx}
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      data: nextProps.initialData
    });
  }

  _fireDataChange(data) {
    this.props.onDataChange(data);
  }

  _sort(key) {
    let data = Array.from(this.state.data);
    const descending = this.state.sortBy === key && !this.state.descending;

    data.sort(function (a, b) {
      return descending
        ? (a[key] < b[key] ? 1 : -1)
        : (a[key] > b[key] ? 1 : -1)
    });

    this.setState({
      data,
      sortBy: key,
      descending
    });

    this._fireDataChange(data);
  }

  _showEditor(e) {
    this.setState({
      edit: {
        row: parseInt(e.target.dataset.row, 10),
        key: e.target.dataset.key,
      }
    });
  }

  _save(e) {
    e.preventDefault();
    const
      value = this.refs.input.getValue(),
      {edit: {row, key}} = this.state
      ;
    let data = Array.from(this.state.data);

    data[row][key] = value;

    this.setState({
      edit: null,
      data
    });

    this._fireDataChange(data);
  }

  _actionClick(rowidx, action) {
    this.setState({
      dialog: {type: action, idx: rowidx}
    });
  }

  _deleteConfirmationClick(action) {
    if (action === 'dismiss') {
      this._closeDialog();
      return;
    }
    let data = Array.from(this.state.data);
    data.splice(this.state.dialog.idx, 1);
    this.setState({
      dialog: null,
      data
    });

    this._fireDataChange(data);
  }

  _closeDialog() {
    this.setState({
      dialog: null
    });
  }

  _saveDataDialog(action) {
    if (action === 'dismiss') {
      this._closeDialog();
      return;
    }
    let data = Array.from(this.state.data);
    data[this.state.dialog.idx] = this.refs.form.getData();
    this.setState({
      dialog: null,
      data
    });

    this._fireDataChange(data);
  }

  _renderDialog() {
    const {dialog} = this.state;
    if (!dialog) {
      return null;
    }

    switch (dialog.type) {
      case 'delete':
      {
        return this._renderDeleteDialog();
      }
      case 'info':
      {
        return this._renderFormDialog(true);
      }
      case 'edit':
      {
        return this._renderFormDialog();
      }
      default:
      {
        throw Error(`Unexpedted dialog type ${dialog.type}`);
      }
    }
  }

  _renderDeleteDialog() {
    const
      {dialog, data} = this.state,
      first = data[dialog.idx],
      nameGuess = first[Object.keys(first)[0]]
      ;

    return (
      <Dialog
        modal={true}
        header="Confirm deletion"
        confirmLabel="Delete"
        onAction={this._deleteConfirmationClick.bind(this)}
      >
        {`Are you sure you want to delete "${nameGuess}"?`}
      </Dialog>
    );
  }

  _renderFormDialog(readonly) {
    return (
      <Dialog
        modal={true}
        header={readonly ? 'Item info' : 'Edit item'}
        confirmLabel={readonly ? ' Ok': 'Save'}
        hasCancel={!readonly}
        onAction={this._saveDataDialog.bind(this)}
      >
        <Form
          ref="form"
          fields={this.props.schema}
          initialData={this.state.data[this.state.dialog.idx]}
          readonly={readonly}
        />
      </Dialog>
    );
  }

  _renderTable() {
    const
      {schema} = this.props,
      {sortBy, descending, data} = this.state
      ;

    return (
      <table>
        <thead>
        <tr>
          {schema.map(item => {
            if (!item.show) {
              return null;
            }
            let title = item.label;
            if (sortBy === item.id) {
              title += descending ? ' \u2191' : ' \u2193';
            }
            return (
              <th
                className={`schema-${item.id}`}
                key={item.id}
                onClick={this._sort.bind(this, item.id)}
              >
                {title}
              </th>
            );
          }, this)}
          <th className="ExcelNotSortable">Actions</th>
        </tr>
        </thead>
        <tbody
          onDoubleClick={this._showEditor.bind(this)}
        >
        {data.map((row, rowIdx) => {
          return (
            <tr key={rowIdx}>
              {Object.keys(row).map((cell, idx) => {
                const
                  schema = this.props.schema[idx],
                  {edit} = this.state
                  ;
                let content = row[cell];
                if (!schema || !schema.show) {
                  return null;
                }
                if (edit && edit.row === rowIdx && edit.key === schema.id) {
                  content = (
                    <form
                      onSubmit={this._save.bind(this)}
                    >
                      <FormInput ref="input" {...schema} defaultValue={content}/>
                    </form>
                  );
                }
                return (
                  <td
                    className={classNames({
                      [`schema-${schema.id}`]: true,
                      'ExcelDataLeft': schema.align === 'left',
                      'ExcelDataRight': schema.align === 'right',
                      'ExcelDataCenter': schema.align !== 'left' && schema.align !== 'right',
                    })}
                    key={idx}
                    data-row={rowIdx}
                    data-key={schema.id}
                  >
                    {content}
                  </td>
                );
              }, this)}
              <td className="ExcelDataCenter">
                <Actions onAction={this._actionClick.bind(this, rowIdx)}/>
              </td>
            </tr>
          );
        }, this)}
        </tbody>
      </table>
    );
  }

  render() {
    return (
      <div className="Excel">
        {this._renderTable()}
        {this._renderDialog()}
      </div>
    );
  }
}

Excel.propTypes = {
  schema: PropTypes.arrayOf(
    PropTypes.object
  ),
  initialData: PropTypes.arrayOf(
    PropTypes.object
  ),
  onDataChange: PropTypes.func,
};

export default Excel