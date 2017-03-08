import React, {Component, PropTypes} from 'react';

import {
  List,
  Toolbar,
  ListHeader,
  ListFooter
} from '../components';

class ViewSLAs extends Component {

  render() {
    const {handleAddSLA} = this.props;

    const
      listProps = {
        headers: ['Name', 'Workplace', 'Frequency', 'Status'],
        data: [
          [
            {id: 'name', type: 'input', value: 'iCare member'},
            {id: 'workplace', type: 'input', value: 'iCare reloaded'},
            {id: 'frequency', type: 'input', value: 'every week at 10:00 AM'},
            {id: 'status', type: 'input', value: 'running'},
          ],
          [
            {id: 'name', type: 'input', value: 'Hire date'},
            {id: 'workplace', type: 'input', value: 'Engineering'},
            {id: 'frequency', type: 'input', value: 'at 10:00 AM'},
            {id: 'status', type: 'input', value: 'inactive'},
          ]
        ],
        readonly: true,
        actions: [
          {name: 'enable', label: 'Enable'},
          {name: 'details', label: 'View details'}
        ],
        handleDoubleClick: (dataset) => {
          const {row, cell} = dataset;
          console.log('click on field', {row, cell});
        },
      },
      toolsbarProps = {
        buttons: [
          {id: 'add', className: 'sbold green', icon: 'fa fa-plus', label: 'Add', handleOnClick: handleAddSLA}
        ],
        tools: []
      }
      ;

    return (
      <div className="row">
        <div className="col-md-12">
          <Toolbar
            {...toolsbarProps}
          />

          <ListHeader />
          <List
            {...listProps}
          />
          <ListFooter />
        </div>
      </div>
    );
  }
}

ViewSLAs.propTypes = {
  handleAdd: PropTypes.func,
};

export default ViewSLAs
