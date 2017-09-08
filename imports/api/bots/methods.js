import {Meteor} from 'meteor/meteor';
import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import Bots from './functions';
import {ESFuncs} from '/imports/api/elastic';
import {Facebook} from '/imports/api/facebook-graph';
import {formatMessage} from '/imports/utils/defaults';
import {deleteExpiredIndices, deleteExpiredLog} from '/imports/api/admin';
import accounting from 'accounting';

/* Collections */
import {MSLA} from '/imports/api/collections/monitor-sla';

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
  async run({data}) {
    if (Meteor.isServer) {
      const {country} = data;
      const {facebook: {adminWorkplace}} = Meteor.settings;
      let message = '';
      try {
        const result = await ESFuncs.migrateToElastic(country);
        message = result.message;
      } catch (e) {
        message = formatMessage({heading1: 'REINDEX_CUSTOMER_TYPES', code: {error: e}});
      }

      await Facebook().postMessage(adminWorkplace, message);
      console.log('message', message);
    }
  }
});

/**
 * Method called by job server for executing the job migrate data
 * @param {String} slaId
 */
const indexRFM = new ValidatedMethod({
  name: 'bots.indexRFM',
  validate: new SimpleSchema({
    data: {
      type: Object,
    },
    'data.method': {
      type: String,
      allowedValues: ['bots.indexRFM'],
    },
    'data.country': {
      type: String,
      allowedValues: ['kh', 'vn', 'la'],
    }
  }).validator(),
  async run({data}) {
    if (Meteor.isServer) {
      const {country} = data;
      const {facebook: {adminWorkplace}} = Meteor.settings;
      let message = '';
      try {
        const result = await ESFuncs.indexRFM(country);
        message = result.message;
      } catch (err) {
        message = formatMessage({heading1: 'REINDEX_RFM', code: err.message});
      }

      await Facebook().postMessage(adminWorkplace, message);
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
  async run({data}) {
    if (Meteor.isServer) {
      try {
        const result = await Bots.addWorkplaceSuggester();
        return result;
      } catch (err) {
        throw  new Meteor.Error('bots.indexSuggests', err.message);
      }
    }
  }
});

const cleanupIndices = new ValidatedMethod({
  name: 'bots.cleanupIndices',
  validate: new SimpleSchema({
    data: {
      type: Object,
    },
    'data.method': {
      type: String,
      allowedValues: ['bots.cleanupIndices'],
    }
  }).validator(),
  async run({data}) {
    if (Meteor.isServer) {
      try {
        const result = await deleteExpiredIndices();
        return result;
      } catch (err) {
        throw new Meteor.Error('bots.cleanupIndices', err.message);
      }
    }
  }
});

const cleanupLog = new ValidatedMethod({
  name: 'bots.cleanupLog',
  validate: new SimpleSchema({
    data: {
      type: Object,
    },
    'data.method': {
      type: String,
      allowedValues: ['bots.cleanupLog'],
    }
  }).validator(),
  run({data}) {
    if (Meteor.isServer) {
      try {
        const result = deleteExpiredLog();
        console.log('result', result);
        return result;
      } catch (err) {
        throw new Meteor.Error('bots.cleanupLog', err.message);
      }
    }
  }
});

/**
 * Method Notify for Monitor SLA (server only)
 */
const notify = new ValidatedMethod({
  name: 'bots.notify',
  validate: null,
  run({data}) {
    try {
      if (data) {
        // console.log('processing alarm Data');
        if (data.Message) {
          const
            subject = data.Subject,
            message = JSON.parse(data.Message);
          const {name, state, stateValue, detail, timestamp} = Bots.processAlarmData(message);
          const SLA = MSLA.findOne({name});
          if (SLA) {
            const {_id, conditions, noteGroup, unit: stateUnit, contacts, lastAlarmMethod} = SLA;
            const notification = {
              subject, name, state, stateValue: accounting.format(stateValue), stateUnit,
              detail, timestamp, noteGroup, contacts
            };
            let method = lastAlarmMethod || 'note';
            if(state !== 'OK') {
              const {alarmMethod} = Bots.getAlarmMethod(state, stateValue, conditions);
              method = alarmMethod;
            }

            Bots.notifyByMethod(method, notification);
            // Update lastAlarmMethod for current SLA
            MSLA.update({_id}, {$set: {lastAlarmMethod: method}});
          }
        }
      }
      return 'received alarm Data';
    } catch (err) {
      throw new Meteor.Error('BOTS_API.notify', err.message);
    }
  }
});

const BotsMethods = {
  testBots,
  elastic,
  migrateToElastic,
  indexSuggests,
  indexRFM
};

export default BotsMethods
