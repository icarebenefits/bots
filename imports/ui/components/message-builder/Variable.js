/**
 * Created by vinhcq on 3/17/17.
 */
import React, {Component} from 'react';

import {
  Selectbox,
  SelectboxGrouped,
  FormInput,
  Label,
  Button,
} from '../elements';
import {
  Fields,
  FieldsGroups
} from '/imports/api/fields';

export class Variable extends Component {

  constructor(props) {
    super(props);
  }

  _getFilters() {
    const
      listGroups = Object.keys(FieldsGroups)
      ;

    const grpOptions = listGroups.map(groupName => {
      const {props: {id: name, name: label}, fields} = FieldsGroups[groupName];
      const listFields = Object.keys(fields);
      const options = []; // temporary support for count only
      // const options = listFields
      //   // message builder apply for number fields only
      //   .filter(f => fields[f]().props.type === 'number')
      //   .map(f => {
      //     const {id: name, name: label} = fields[f]().props;
      //     return {name, label};
      //   });
      options.splice(0, 0, {name: 'total', label: 'total'});
      options.splice(0, 0, {name: '', label: ''});
      return {name, label, options};
    });

    return grpOptions;
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
            : (<SelectboxGrouped
            className="form-control"
            value={field}
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