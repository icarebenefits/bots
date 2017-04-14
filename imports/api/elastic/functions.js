import {Meteor} from 'meteor/meteor';
import moment from 'moment';


import {customers} from '/imports/api/olap';

/**
 * Function
 * @param country
 */
const migrateToElastic = (country = 'kh') => {
  if(Meteor.isServer) {
    const
      runDate = new Date(),
      prefix = 'bots',
      {env} = Meteor.settings.public,
      suffix = moment(runDate).format('YYYY.MM.DD-HH.mm'),
      {Logger} = require('/imports/api/logger')
      ;

    customers({country});
  }
};

const Functions = {
  migrateToElastic,
};

export default Functions