import {Meteor} from 'meteor/meteor';
import moment from 'moment';
import _ from 'lodash';

import {formatMessage} from '/imports/utils/defaults';
import {Facebook} from '/imports/api/facebook-graph';
/* Elastic */
import {ElasticClient as Elastic} from '/imports/api/elastic';

/* Collections */
import {Countries} from '/imports/api/collections/countries';
import {Logger} from '/imports/api/collections/logger';

export const getExpiredIndices = async() => {
  const
    today = new Date(),
    {duration, unit} = Meteor.settings.admin.cleanup.indices,
    {public: {env}, elastic: {indexPrefix}} = Meteor.settings,
    cleanupDate = moment(today)
      .subtract(duration, unit)
      .format('YYYY-MM-DD');

  try {
    // get all supported country
    const countries = Countries.find({status: 'active'}, {fields: {code: true}}).fetch();
    // create filter list of bots indices
    const filters = countries.map(c => `${indexPrefix}_${c.code}_${env}`);

    // get all indices from Elastic
    const indices = await Elastic.cat.indices();

    // get all current bots indices, and filter the expired indices
    const botsIndices = indices
      .split('\n')
      .map(b => b.split(' ')[2]) // get the name of index
      .filter(i => _.isEmpty(i) ?
        false :
        filters.includes(i.split('-')[0]
        ))
      .filter(b => moment(new Date(b.split('-')[1])).isBefore(moment(new Date(cleanupDate))) ? true : false);

    return botsIndices;
  } catch (err) {
    throw new Meteor.Error('getExpiredIndices', err.message);
  }
};

export const deleteExpiredIndices = async() => {
  try {
    const expiredIndices = await getExpiredIndices();
    if(!_.isEmpty(expiredIndices)) {
      const deleteIndices = await Elastic.indices.delete({index: expiredIndices});
      console.log('deleteExpiredIndices', deleteIndices);

      /* send result to facebook */
      const message = formatMessage({message: '', heading1: 'DELETE_EXPIRED_INDEX', code: {expiredIndices}});
      const {adminWorkplace} = Meteor.settings.facebook;
      await Facebook().postMessage(adminWorkplace, message);

      return deleteIndices;
    }
  } catch (err) {
    throw new Meteor.Error('deleteExpiredIndices', err.message);
  }
};

export const deleteExpiredLog = () => {
  try {
    const
      today = new Date(),
      {duration, unit} = Meteor.settings.admin.cleanup.log,
      cleanupDate = moment(today)
        .subtract(duration, unit);
    const selector = {createdAt: {$lt: new Date(cleanupDate)}};
    const removed = Logger.remove(selector);

    /* send result to facebook */
    const message = formatMessage({message: '', heading1: 'DELETE_EXPIRED_LOG', code: {removed}});
    const {adminWorkplace} = Meteor.settings.facebook;
    Facebook().postMessage(adminWorkplace, message);

    return {result: true};
  } catch (err) {
    throw new Meteor.Error('deleteExpiredLog', err.message);
  }
};