import {Meteor} from 'meteor/meteor';
/* Field */
import {Field} from '/imports/api/fields';

export const getESField = (type, group, field) => {
  let ESField = '';
  if (field === 'total') {
    if (type !== 'value_count') { //
      throw Meteor.Error('BUILD_AGGREGATION', `${field} is only supported by Summary type: count`);
    }
    ESField = Field()[group]().elastic().id;
  } else {
    ESField = Field()[group]().field()[field]().elastic().field;
  }

  return ESField;
};