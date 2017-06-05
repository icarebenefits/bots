import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {ValidatedMethod} from 'meteor/mdg:validated-method';
import _ from 'lodash';

/* Collections */
import Countries from './countries';

const Methods = {};

Methods.getTimeZone = new ValidatedMethod({
  name: 'countries.getTimeZone',
  validate: new SimpleSchema({
    code: {
      type: String
    }
  }).validator(),
  run({code}) {
    let timezone = 'Asia/Saigon';  // default timezone
    try {
      const country = Countries.findOne({code}, {fields: {timezone: true}});
      if(!_.isEmpty(country)) {
        timezone = country.timezone;
      }
      return {timezone};
    } catch(err) {
      throw new Meteor.Error('COUNTRIES_GET_TIMEZONE', err.message);
    }
  }
});

export default Methods