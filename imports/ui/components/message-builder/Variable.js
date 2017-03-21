/**
 * Created by vinhcq on 3/17/17.
 */
import React, {Component} from 'react';

import {
  Selectbox,
  FormInput,
  Label,
  Button,
} from '../elements';
import {Fields} from '/imports/api/fields';

export class Variable extends Component {

  constructor(props) {
    super(props);
  }

  _getFilters() {
    const
      listFields = Object.keys(Fields)
      ;

    const filters = listFields.map(field => {
      const {id: name, name: label} = Fields[field]().props;
      return {name, label};
    });
    filters.splice(0, 0, {name: '', label: ''});

    return filters;
  }

  render() {
    const
      {
        id,
        variable: {summaryType = '', field = '', name = ''},
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
                {name: 'count', label: 'count'},
                {name: 'sum', label: 'sum'},
                {name: 'average', label: 'average'},
              ]}
              handleOnChange={value => handleFieldChange(id, 'summaryType', value)}
            />)
          }
        </td>
        <td data-row={id}>
          {readonly
            ? field
            : (<Selectbox
              className="form-control"
              value={field}
              options={filters}
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