/**
 * Created by vinhcq on 3/17/17.
 */
import React, {Component} from 'react';

import {
  Selectbox,
  SelectboxGrouped,
  FormInput,
  Button,
} from '../elements';
import {Field} from '/imports/api/fields';

export class Variable extends Component {

  constructor(props) {
    super(props);
  }

  _getFilters() {
    const
      listGroups = Object.keys(Field())
      ;

    const grpOptions = listGroups.map(group => {
      const
        Fields = Field()[group]().field,
        {id: name, name: label} = Field()[group]().props();
      const listFields = Object.keys(Fields());

      const options = listFields
      // message builder apply for number fields only
        .filter(f => {
          return Fields()[f]().props().type === 'number'
        })
        .map(f => {
          const {id: name, name: label} = Fields()[f]().props();
          return {name, label};
        });
      options.splice(0, 0, {name: `${group}-total`, label: 'total'});
      return {name, label, options};
    });

    grpOptions.splice(0, 0, {
      name: 'empty',
      label: '',
      options: [{name: '', label: ''}]
    });

    return grpOptions;
  }

  render() {
    const
      {
        id,
        variable: {summaryType = '', group = '', field = '', name = ''},
        handlers: {
          handleFieldChange,
          handleRemoveRow,
        },
        readonly = false,
      } = this.props,
      filters = this._getFilters();
    return (
      <tr>
        <td data-row={id}>
          {readonly
            ? summaryType
            : (<Selectbox
            className="form-control"
            value={summaryType}
            options={[
                {name: '', label: ''},
                {name: 'value_count', label: 'count'},
                {name: 'sum', label: 'sum'},
                {name: 'max', label: 'max'},
                {name: 'min', label: 'min'},
                {name: 'avg', label: 'average'},
              ]}
            handleOnChange={value => handleFieldChange(id, 'summaryType', value)}
          />)
          }
        </td>
        <td data-row={id}>
          {readonly
            ? field
            : (<SelectboxGrouped
            className="form-control"
            value={field === 'total' ? `${group}-total` : field}
            grpOptions={filters}
            handleOnChange={value => handleFieldChange(id, 'field', value)}
          />)
          }
        </td>
        <td data-row={id}>
          {readonly
            ? name :
            <FormInput
              className="form-control"
              value={name}
              handleOnChange={value => handleFieldChange(id, 'name', value)}
            />
          }
        </td>
        <td data-row={id}>
          {readonly
            ? null
            : <div>
            <Button
              onClick={e => {e.preventDefault(); handleRemoveRow(id);}}
              className="btn-danger"
            >Remove</Button>
          </div>
          }
        </td>
      </tr>
    );
  }
}