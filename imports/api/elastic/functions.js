import {Meteor} from 'meteor/meteor';

import {customers} from '/imports/api/olap';

/**
 * Function
 * @param country
 */
const migrateToElastic = (country = 'kh') => {
  if(Meteor.isServer) {
    try {
      customers({country}); }
    catch (e) {
      throw new Meteor.Error('migrateToElastic', JSON.stringify(e));
    }
  }
};

const Functions = {
  migrateToElastic,
};

export default Functions