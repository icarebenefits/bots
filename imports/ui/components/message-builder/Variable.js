import {Meteor} from 'meteor/meteor';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {createContainer} from 'meteor/react-meteor-data';
import _ from 'lodash';

/* Collections */
import {ApiProfile} from '/imports/api/collections/api-profile';
/* Components */
import {
  Checkbox, Selectbox, SelectboxGrouped,
  FormInput, Button,
} from '../elements';
import {Spinner} from '/imports/ui/components/common';
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
      if (isNestedField && bucket) {
        Fields = Fields()[ngroup]().field;
        listFields = Object.keys(Fields());
      }

      const options = listFields
      // message builder apply for number fields only
        .filter(f => Fields()[f]().props().type === 'number')
        .map(f => {
          const {id: name, name: label} = Fields()[f]().props();
          if (isNestedField && bucket) {
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
    const {ready} = this.props;
    if (ready) {
      const
        {
          id,
          useBucket,
          bucketGroup,
          isNestedField,
          variable: {bucket, summaryType = '', apiProfile = '', group = '', field = '', name = ''},
          handlers: {
            handleFieldChange,
            handleRemoveRow,
          },
          apiProfiles,
          isSuperAdmin
        } = this.props,
        usedRestCall = (summaryType === 'rest') || false,
        filters = this._getFilters(bucket, useBucket, bucketGroup, isNestedField);
      let listApiProfiles = [{name: '', label: ''}];

      if (!_.isEmpty(apiProfiles)) {
        listApiProfiles = [
          ...listApiProfiles,
          ...apiProfiles.map(p => ({name: p._id, label: p.name}))
        ];
      }

      return (
        <tr>
          {useBucket && (
            <td data-row={id}>
              <Checkbox
                className="form-control"
                disabled={usedRestCall}
                value={bucket}
                handleOnChange={value => handleFieldChange(id, 'bucket', value)}
              />
            </td>
          )}
          <td data-row={id}>
            <Selectbox
              className="form-control"
              value={summaryType}
              options={isSuperAdmin ? AGGS_OPTIONS.superAdminUser : AGGS_OPTIONS.normalUser}
              handleOnChange={value => handleFieldChange(id, 'summaryType', value)}
            />
          </td>
          <td data-row={id}>
            <SelectboxGrouped
              disabled={usedRestCall}
              className="form-control"
              value={field === 'total' ? `${group}-total` : field}
              grpOptions={filters}
              handleOnChange={value => handleFieldChange(id, 'field', value)}
            />
          </td>
          {isSuperAdmin && (
            <td data-row={id}>
              <Selectbox
                className="form-control"
                disabled={!usedRestCall}
                value={apiProfile}
                options={listApiProfiles}
                handleOnChange={value => handleFieldChange(id, 'apiProfile', value)}
              />
            </td>
          )}
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
                onClick={e => {
                  e.preventDefault();
                  handleRemoveRow(id);
                }}
                className="btn-danger"
              >Remove</Button>
            </div>
          </td>
        </tr>
      );
    }

    return (<tr><td><div><Spinner/></div></td></tr>);
  }
}

Variable.propTypes = {
  ready: PropTypes.bool,
  apiProfiles: PropTypes.array,
  useBucket: PropTypes.bool,
  bucketGroup: PropTypes.string,
  isNestedField: PropTypes.bool,
  variable: PropTypes.shape({
    bucket: PropTypes.bool,
    summaryType: PropTypes.string,
    apiProfile: PropTypes.string,
    group: PropTypes.group,
    field: PropTypes.string,
    name: PropTypes.string
  }),
  isSuperAdmin: PropTypes.bool,
  handlers: PropTypes.shape({
    handleFieldChange: PropTypes.func,
    handleRemoveRow: PropTypes.func
  })
};

const VariableContainer = createContainer(() => {
  const
    sub = Meteor.subscribe('api_profile_list'),
    ready = sub.ready(),
    apiProfiles = ApiProfile.find().fetch();

  return {ready, apiProfiles};
}, Variable);

export default VariableContainer