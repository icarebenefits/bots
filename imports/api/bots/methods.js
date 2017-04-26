import {Meteor} from 'meteor/meteor';
import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import Bots from './functions';
import {ESFuncs} from '/imports/api/elastic';

/**
 * Method called by job server for testing the job check SLA
 * @param {String} slaId
 */
const testBots = new ValidatedMethod({
  name: 'bots.test',
  validate: null,
  run() {
    if (Meteor.isServer) {
      const result = Bots.fistSLACheck();
      return result;
    }
  }
});

/**
 * Method called by job server for executing the job check SLA
 * @param {String} slaId
 */
const elastic = new ValidatedMethod({
  name: 'bots.elastic',
  validate: new SimpleSchema({
    data: {
      type: Object,
    },
    'data.method': {
      type: String,
      allowedValues: ['bots.elastic'],
    },
    'data.slaId': {
      type: String,
    }
  }).validator(),
  run({data}) {
    if (!this.isSimulation) {
      const {slaId} = data;
      const result = Bots.checkSLA(slaId);
      return result;
    }
  }
});

/**
 * Method called by job server for executing the job migrate data
 * @param {String} slaId
 */
const migrateToElastic = new ValidatedMethod({
  name: 'bots.migrateToElastic',
  validate: new SimpleSchema({
    data: {
      type: Object,
    },
    'data.method': {
      type: String,
      allowedValues: ['bots.migrateToElastic'],
    },
    'data.country': {
      type: String,
      allowedValues: ['kh', 'vn', 'la'],
    }
  }).validator(),
  run({data}) {
    if (Meteor.isServer) {
      const {country} = data;
      let result = {};
      try {
        result = ESFuncs.migrateToElastic(country);
      } catch (e) {
        throw  new Meteor.Error('methods.migrateToElastic', JSON.stringify(e));
      }
      return result;
    }
  }
});

/**
 * Method called by job server for executing the job index suggests
 * @param {String} slaId
 */
const indexSuggests = new ValidatedMethod({
  name: 'bots.indexSuggests',
  validate: new SimpleSchema({
    data: {
      type: Object,
    },
    'data.method': {
      type: String,
      allowedValues: ['bots.indexSuggests'],
    }
  }).validator(),
  run({data}) {
    if (Meteor.isServer) {
      let result = {};
      try {
        result = Bots.addWorkplaceSuggester();
      } catch (e) {
        throw  new Meteor.Error('methods.indexSuggests', JSON.stringify(e));
      }
      return result;
    }
  }
});

const BotsMethods = {
  testBots,
  elastic,
  migrateToElastic,
  indexSuggests,
};

export default BotsMethods
