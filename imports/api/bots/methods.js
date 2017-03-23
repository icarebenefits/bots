import {Meteor} from 'meteor/meteor';
import {ValidatedMethod} from 'meteor/mdg:validated-method';
import Bots from './functions';

const testBots = new ValidatedMethod({
  name: 'bots.test',
  validate: null,
  run({}) {
    if(Meteor.isServer) {
      const result = Bots.fistSLACheck();
      return result;
    }
  }
});

const elastic = new ValidatedMethod({
  name: 'bots.elastic',
  validate: null,
  run({slaId}) {
    if(Meteor.isServer) {
      const result = Bots.executeElastic(slaId);
      return result;
    }
  }
});

const BotsMethods = {
  testBots,
};

export default BotsMethods
