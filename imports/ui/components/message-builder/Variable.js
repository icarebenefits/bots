import React, {Component} from 'react';
import _ from 'lodash';

import {
  Checkbox,
  Selectbox,
  SelectboxGrouped,
  FormInput,
  Button,
} from '../elements';
import {Field} from '/imports/api/fields';

/* CONSTANTS */
import {AGGS_OPTIONS} from '/imports/ui/store/constants';

class Variable extends Component {

  _getFilters(bucket, useBucket, bucketGroup, isNestedField) {
    const ngroup = 'soItems';
    const listGroups = (bucket && useBucket && !_.isEmpty(bucketGroup) && bucketGroup !== 'empty')
      ? [bucketGroup]
      : Object.keys(Field());
    const grpOptions = listGroups.map(group => {
      let
        Fields = Field()[group]().field,
        {id: name, name: label} = Field()[group]().props(),
        listFields = Object.keys(Fields());
      if(isNestedField) {
        Fields = Fields()[ngroup]().field;
        listFields = Object.keys(Fields());
      }

      const options = listFields
      // message builder apply for number fields only
        .filter(f => Fields()[f]().props().type === 'number')
        .map(f => {
          const {id: name, name: label} = Fields()[f]().props();
          if(isNestedField) {
            return {
              name: `${ngroup}.${name}`,
              label: `${ngroup} ${label}`
            };
          }
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
        useBucket,
        bucketGroup,
        isNestedField,
        variable: {bucket, summaryType = '', group = '', field = '', name = ''},
        handlers: {
          handleFieldChange,
          handleRemoveRow,
        },
      } = this.props,
      filters = this._getFilters(bucket, useBucket, bucketGroup, isNestedField);
    return (
      <tr>
        {useBucket && (
          <td data-row={id}>
            <Checkbox
              className="form-control"
              value={bucket}
              handleOnChange={value => handleFieldChange(id, 'bucket', value)}
            />
          </td>
        )}
        <td data-row={id}>
          <Selectbox
            className="form-control"
            value={summaryType}
            options={[
                {name: '', label: ''},
                ...AGGS_OPTIONS
              ]}
            handleOnChange={value => handleFieldChange(id, 'summaryType', value)}
          />
        </td>
        <td data-row={id}>
          <SelectboxGrouped
            className="form-control"
            value={field === 'total' ? `${group}-total` : field}
            grpOptions={filters}
            handleOnChange={value => handleFieldChange(id, 'field', value)}
          />
        </td>
        <td data-row={id}>
          <FormInput
            className="form-control"
            value={name}
            handleOnChange={value => handleFieldChange(id, 'name', value)}
          />
        </td>
        <td data-row={id}>
          <div>
            <Button
              onClick={e => {e.preventDefault(); handleRemoveRow(id);}}
              className="btn-danger"
            >Remove</Button>
          </div>
        </td>
      </tr>
    );
  }
}

Variable.propTypes = {};

export default Variable