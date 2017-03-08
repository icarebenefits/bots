import React, {Component, PropTypes} from 'react';

import {Form} from '../components/elements'

class Workplaces extends Component {
  render() {
    const fields = [
      {
        id: 'name', label: 'Group name', type: 'string', value: '',
        className: 'form-control',
        handleOnChange: (value) => console.log('input value: ', value)
      },
      {
        id: 'id', label: 'Group ID', type: 'string', value: '',
        className: 'form-control',
        handleOnChange: (value) => console.log('input value: ', value)
      }
    ];
    
    return (
      <div className="page-content-col">
        <div className="row">
          <div className="col-md-6">
            <Form
              fields={fields}
            />
          </div>
        </div>
      </div>
    );
  }
}

Workplaces.propTypes = {

};

export default Workplaces