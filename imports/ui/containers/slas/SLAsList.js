import React, {Component, PropTypes} from 'react';

// components
import Table from '../../components/Table';
import Button from '../../components/Button';

class SLAsList extends Component {

  handleOnClick(rowIdx, action) {
    console.log(action);
    switch(action) {
      case 'edit': {
        return FlowRouter.go('condition-builder-tree', {action}, {id: rowIdx});
      }
      case 'delete': {
        return FlowRouter.go('condition-builder-tree', {action}, {id: rowIdx});
      }
      default: {
        return FlowRouter.go('condition-builder-tree', {action: 'create'});
      }
    }
  }

  render() {
    const
      headers = [
        {id: 'id', label: 'ID'},
        {id: 'name', label: 'Name'},
        {id: 'expr', label: 'Expression'},
      ],
      data = [
        [
          '1234',
          "Chris's emails",
          'Email is Chris',
        ],
        [
          '334312',
          "hire member",
          'Hire date on YYYY/MM/DD hh:mm:ss'
        ]
      ],
      {label = 'Create'} = this.props
    ;

    return (
      <div className="container">
        <div className="row" style={{marginBottom: 5}}>
          <Button
            className="btn-primary"
            onClick={this.handleOnClick}
          >
            <span className="glyphicon glyphicon-plus" />
            {` ${label}`}
          </Button>
        </div>
        <div className="row">
          <Table
            className="table-bordered"
            headers={headers}
            data={data}
            hasActions={true}
            handleOnClick={this.handleOnClick}
          />
        </div>
      </div>
    );
  }
}

SLAsList.propTypes = {};

export default SLAsList