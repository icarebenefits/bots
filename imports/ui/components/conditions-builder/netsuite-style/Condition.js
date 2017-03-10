import React, {Component} from 'react';

import {
  Checkbox,
  Selectbox,
  Label,
  Button,
} from '../../elements';
import {Schema} from './schema';

export class Condition extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const
      {
        id,
        condition: {
          not = false, openParens = '', filter = '', operator = '', values = [], closeParens = '', bitwise = ''
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
      {listFields} = Schema,
      filters = [{name: '', label: ''}],
      description = getDescription({operator, values})
      ;

    listFields.map(fieldId => {
      const {id: name, description: label} = getFieldProps(fieldId);
      filters.push({name, label});
    });

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
            : (<Selectbox
            className="form-control"
            value={filter || ''}
            options={filters}
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