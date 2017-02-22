import React, {Component, PropTypes} from 'react';

import Button from '../components/Button'; // for the add new item
import Dialog from '../components/Dialog'; // to pop the add new item form
import Excel from '../components/Excel'; // the table of all items
import Form from '../components/Form'; // the add new item form

class B2BForm extends Component {

  constructor(props) {
    super(props);

    this.state = {
      data: props.initialData,
      addNew: false,
    };

    this._preSearchData = null;
  }

  _addNewDialog() {
    this.setState({addNew: true});
  }

  _addNew(action) {
    if(action === 'dismiss') {
      this.setState({addNew: false});
      return;
    }

    let data = Array.from(this.state.data);
    data.unshift(this.refs.form.getData());
    this.setState({
      addNew: false,
      data
    });

    this._commitToStorage(data);
  }

  _onExcelDataChange(data) {
    this.setState({data});
    this._commitToStorage(data);
  }

  _commitToStorage(data) {
    localStorage.setItem('data', JSON.stringify(data));
  }

  _startSearching() {
    this._preSearchData = this.state.data;
  }

  _doneSearching() {
    this.setState({data: this._preSearchData})
  }

  _search(e) {
    const needle = e.target.value.toLowerCase();
    if(!needle) {
      this.setState({
        data: this._preSearchData
      });
      return;
    }
    const
      fields = this.props.schema.map(item => item.id),
      max = fields.length || 0,
      searchData = this._preSearchData.filter(row => {
        for(let f = 0; f < max; f++) {
          if(row[fields[f]].toString().toLowerCase().indexOf(needle) > -1) {
            return true;
          }
        }
        return false;
      });
    this.setState({data: searchData});
  }

  render() {
    const
      {schema} = this.props,
      {data, addNew} = this.state
      ;

    return (
      <div className="B2BForm">
        <div className="B2BFormToolbar">
          <div className="B2BFormToolbarAdd">
            <Button
              className="B2BFormToolbarAddButton"
              onClick={this._addNewDialog.bind(this)}
            >
              + add
            </Button>
          </div>
          <div className="B2BFormToolbarSearch">
            <input
              placeholder="Search..."
              onChange={this._search.bind(this)}
              onFocus={this._startSearching.bind(this)}
              onBlur={this._doneSearching.bind(this)}
            />
          </div>
        </div>
        <div className="B2BFormDataGrid">
          <Excel
            schema={schema}
            initialData={data}
            onDataChange={this._onExcelDataChange.bind(this)}
          />
        </div>
        {addNew
          ? <Dialog
          modal={true}
          header="Add new item"
          confirmLabe="Add"
          onAction={this._addNew.bind(this)}
        >
          <Form
            ref="form"
            fields={schema}
          />
        </Dialog>
          : null
        }
      </div>
    );
  }
}

B2BForm.propTypes = {
  schema: PropTypes.arrayOf(
    PropTypes.object
  ),
  initialData: PropTypes.arrayOf(
    PropTypes.any
  ),
};

export default B2BForm