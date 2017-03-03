import React, {Component} from 'react';
import _ from 'lodash';
import moment from 'moment';

import {Checkbox} from './Checkbox';
import {Selectbox} from './Selectbox';
import {Label} from './Label';
import {Schema} from './schema';
import Button from '../Button';

export class Condition extends Component {

  constructor(props) {
    super(props);

    // const defaultState = getDefaultState();

    // this.state = {
    //   operator: '',
    //   operatorType: '',
    //   dialog: null, // get field had been change,
    //   hidden: true, // flag for second value of dialog form,
    // };

  }

  componentWillReceiveProps(nextProps) {
    // when props change
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
        }
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
        <td>
          <Checkbox
            value={not}
            handleOnChange={value => handleFieldChange(id, 'not', value)}
          />
        </td>
        <td>
          <Selectbox
            value={openParens}
            options={[
              {name: '', label: ''},
              {name: '(', label: '('},
              {name: '((', label: '(('},
              {name: '(((', label: '((('},
            ]}
            handleOnChange={value => handleFieldChange(id, 'openParens', value)}
          />
        </td>
        <td>
          <Selectbox
            value={filter || ''}
            options={filters}
            handleOnChange={value => handleFieldChange(id, 'filter', value)}
          />
        </td>
        <td>
          <Label value={description}/>
        </td>
        <td>
          <Selectbox
            value={closeParens}
            options={[
              {name: '', label: ''},
              {name: ')', label: ')'},
              {name: '))', label: '))'},
              {name: ')))', label: ')))'},
            ]}
            handleOnChange={value => handleFieldChange(id, 'closeParens', value)}
          />
        </td>
        <td>
          <Selectbox
            value={bitwise}
            options={[
              {name: '', label: ''},
              {name: 'and', label: 'And'},
              {name: 'or', label: 'Or'},
            ]}
            handleOnChange={value => handleFieldChange(id, 'bitwise', value)}
          />
        </td>
        <td>
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