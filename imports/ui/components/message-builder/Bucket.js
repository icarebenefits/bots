import React, {Component, PropTypes} from 'react';
import _ from 'lodash';

/* Components */
import {Selectbox, SelectboxGrouped} from '../elements';
import {Field} from '/imports/api/fields';

class Bucket extends Component {
  
  _getFilters() {
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
  }
  
  render() {
    const {group = '', field = '', options = {}, hasOption, onChange} = this.props;
    const filters = this._getFilters();

    return (
      <table className="table table-striped">
        <thead>
        <tr>
          <th>Field</th>
          {hasOption && (
            <th>Interval</th>
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
                ref="interval"
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
        </tr>
        </tbody>
      </table>
    );
  }
}

Bucket.propTypes = {
  group: PropTypes.string,
  field: PropTypes.string,
  options: PropTypes.object,
  hasOption: PropTypes.bool,
  onChange: PropTypes.func
};

export default Bucket