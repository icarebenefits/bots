import React, {Component} from 'react';

import {
  Checkbox,
  Selectbox,
  SelectboxGrouped,
  Label,
  Button,
} from '../elements';
import {
  Fields,
  FieldsGroups
} from '/imports/api/fields';

export class Condition extends Component {

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
      const options = listFields.map(field => {
        const {id: name, name: label} = fields[field]().props;
        return {name, label};
      });
      options.splice(0, 0, {name: '', label: ''});
      return {name, label, options};
    });

    return grpOptions;
  }

  render() {
    const
      {
        id,
        condition: {
          not = false, openParens = '', group = '', filter = '', field = '',
          operator = '', values = [], closeParens = '', bitwise = ''
        },
        handlers: {
          handleFieldChange,
          getFieldProps,
          handleRemoveCondition,
          handleInsertCondition,
          getDescription,
        },
        readonly = true,
      } = this.props,
      filters = this._getFilters(),
      description = getDescription({field, operator, values})
      ;
    // console.log(operator, values)

    return (
      <tr>
        <td data-row={id}>
          {readonly
            ? not ? '!' : ''
            : (<Checkbox
            className="form-control"
            value={not}
            handleOnChange={value => handleFieldChange(id, 'not', value)}
          />)
          }
        </td>
        <td data-row={id}>
          {readonly
            ? openParens
            : (<Selectbox
            className="form-control"
            value={openParens}
            options={[
                {name: '', label: ''},
                {name: '(', label: '('},
                {name: '((', label: '(('},
                {name: '(((', label: '((('},
              ]}
            handleOnChange={value => handleFieldChange(id, 'openParens', value)}
          />)
          }
        </td>
        <td data-row={id}>
          {readonly
            ? filter
            : (<SelectboxGrouped
            className="form-control"
            value={filter}
            grpOptions={filters}
            handleOnChange={value => handleFieldChange(id, 'filter', value)}
          />)
          }
        </td>
        <td data-row={id}>
          <Label value={description}/>
        </td>
        <td data-row={id}>
          {readonly
            ? closeParens
            : (<Selectbox
            className="form-control"
            value={closeParens}
            options={[
                {name: '', label: ''},
                {name: ')', label: ')'},
                {name: '))', label: '))'},
                {name: ')))', label: ')))'},
              ]}
            handleOnChange={value => handleFieldChange(id, 'closeParens', value)}
          />)
          }
        </td>
        <td data-row={id}>
          {readonly
            ? bitwise
            : (<Selectbox
            className="form-control"
            value={bitwise}
            options={[
                {name: '', label: ''},
                {name: 'and', label: 'And'},
                {name: 'or', label: 'Or'},
              ]}
            handleOnChange={value => handleFieldChange(id, 'bitwise', value)}
          />)
          }
        </td>
        <td data-row={id}>
          {readonly
            ? null
            : <div>
              <Button
                onClick={e => {e.preventDefault(); handleInsertCondition(id);}}
                className="btn-default"
              >Insert</Button>
              {' '}
              <Button
                onClick={e => {e.preventDefault(); handleRemoveCondition(id);}}
                className="btn-danger"
              >Remove</Button>
            </div>
          }
        </td>
      </tr>
    );
  }
}