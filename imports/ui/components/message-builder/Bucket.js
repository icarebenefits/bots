import React, {Component, PropTypes} from 'react';
import _ from 'lodash';

/* Components */
import {Selectbox, SelectboxGrouped} from '../elements';
import {Field} from '/imports/api/fields';

const Bucket = (props) => {
  console.log('props', props);
  const _getFilters = () => {
    const filters = Object
      .keys(Field())
      .map(g => {
        const
          Fields = Field()[g]().field,
          {id: name, name: label} = Field()[g]().props();
        const options = Object
          .keys(Fields())
          .filter(f => Fields()[f]().props().bucket)
          .map(f => {
            const {id: name, name: label} = Fields()[f]().props();
            return {name, label};
          });

        return {name, label, options};
      });

    filters.splice(0, 0, {
      name: 'empty',
      label: '',
      options: [{name: '', label: ''}]
    });

    return filters;
  };

  const {
    group = '', field = '',
    options = {}, hasOption,
    orderBy = '', orderIn = '',
    onChange
  } = props;
  const
    filters = _getFilters(),
    hasField = !_.isEmpty(field),
    hasOrder = !_.isEmpty(orderBy);
  let fieldLabel = '';
  if (group && field) {
    fieldLabel = filters
        .filter(f => f.name === group)[0].options
        .filter(o => o.name === field)[0].label || '';
  }

  return (
    <table className="table table-striped">
      <thead>
      <tr>
        <th>Field</th>
        {hasOption && (
          <th>Interval</th>
        )}
        {hasField && (
          <th>Order by</th>
        )}
        {hasOrder && (
          <th>Order in</th>
        )}
      </tr>
      </thead>
      <tbody>
      <tr>
        <td>
          <SelectboxGrouped
            className="form-control"
            value={field}
            grpOptions={filters}
            handleOnChange={value => onChange('field', value)}
          />
        </td>
        {hasOption && (
          <td>
            <Selectbox
              className="form-control"
              value={options.interval}
              options={[
                  {name: '', label: ''},
                  {name: 'year', label: 'by year'},
                  {name: 'quarter', label: 'by quarter'},
                  {name: 'month', label: 'by month'},
                  {name: 'week', label: 'by week'},
                  {name: 'day', label: 'by day'}
                ]}
              handleOnChange={value => onChange('interval', value)}
            />
          </td>
        )}
        {hasField && (
          <td>
            <Selectbox
              className="form-control"
              value={orderBy}
              options={[
                  {name: '', label: ''},
                  {name: `${field}`, label: `${fieldLabel}`},
                  {name: `value_${field}`, label: `Value of ${fieldLabel}`}
                ]}
              handleOnChange={value => onChange('orderBy', value)}
            />
          </td>
        )}
        {hasOrder && (
          <td>
            <Selectbox
              className="form-control"
              value={orderIn}
              options={[
                  {name: '', label: ''},
                  {name: `desc`, label: 'Descending'},
                  {name: `asc`, label: 'Ascending'}
                ]}
              handleOnChange={value => onChange('orderIn', value)}
            />
          </td>
        )}
      </tr>
      </tbody>
    </table>
  );

}

Bucket.propTypes = {
  group: PropTypes.string,
  field: PropTypes.string,
  options: PropTypes.object,
  hasOption: PropTypes.bool,
  onChange: PropTypes.func
};

export default Bucket