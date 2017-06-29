import {Meteor} from 'meteor/meteor';
/* Field */
import {Field} from '/imports/api/fields';

export const getESField = (type, group, field, isNestedField, bucketField) => {
  let
    ESField = '',
    nfields = field.split('.');

  // validate field is nested field or not
  if (nfields.length <= 1 && isNestedField && field !== 'total')
    throw new Meteor.Error('GET_ES_FIELD', `${field} is not a nested field`);


  if (field === 'total') {
    if (type !== 'value_count') { //
      throw Meteor.Error('GET_ES_FIELD', `${field} is only supported by Summary type: count`);
    }
    if (isNestedField) {
      const bFields = bucketField.split('.');
      if(bFields <= 1) {
        throw new Meteor.Error('GET_ES_FIELD', `${bucketField} is not a nested field`);
      }
      ESField = Field()[group]().field()[bFields[0]]().elastic().id;
    } else {
      ESField = Field()[group]().elastic().id;
    }
  } else {
    if (isNestedField) {
      const
        ngroup = nfields[0],
        nfield = nfields[1];
      ESField = Field()[group]().field()[ngroup]().field()[nfield]().elastic().field;
    } else {
      ESField = Field()[group]().field()[field]().elastic().field;
    }
  }

  return ESField;
};