import {SimpleSchema} from 'meteor/aldeed:simple-schema';

export const IDValidator = {
  _id: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  }
};

