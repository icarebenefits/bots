import React, {Component} from 'react';
import _ from 'lodash';
import moment from 'moment';

import {Checkbox} from '../../elements/Checkbox';
import {Selectbox} from '../../elements/Selectbox';
import {Label} from '../../elements/Label';
import {Schema} from './schema';
import Button from '../../elements/Button';

export class Condition extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const
      {
        id,
        condition: {
          not, openParens, filter, operator, values, closeParens, bitwise
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
            value={not}
            handleOnChange={value => handleFieldChange(id, 'not', value)}
          />)
          }
        </td>
        <td data-row={id}>
          {readonly
            ? openParens
            : (<Selectbox
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
          <div>
            <Button
              onClick={e => handleInsertCondition(id)}
              className="btn-default"
            >Insert</Button>
            {' '}
            <Button
              onClick={e => handleRemoveCondition(id)}
              className="btn-danger"
            >Remove</Button>
          </div>
        </td>
      </tr>
    );
  }
}