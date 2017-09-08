import {Meteor} from 'meteor/meteor';
import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import Facebook from './functions';

const addPhoto = new ValidatedMethod({
  name: 'graph.post',
  validate: new SimpleSchema({
    groupId: {
      type: String
    },
    message: {
      type: String
    },
    imageUrl: {
      type: String,
      optional: true
    }
  }).validator(),
  async run({groupId, message, imageUrl}) {
    try {
      if(!this.isSimulation) {
        const {default: Facebook} = require('./functions');

        const result = await Facebook().addPhoto(groupId, message, imageUrl);
        return result;
      }
    } catch(err) {
      throw new Meteor.Error('WORKPLACE_ADD_PHOTO', err.message);
    }
  }
});

const postToWorkplace = new ValidatedMethod({
  name: 'graph.postMessage',
  validate: new SimpleSchema({
    groupId: {
      type: Number
    },
    message: {
      type: String
    }
  }).validator(),
  async run({groupId, message}) {
    try {
      const result = await Facebook().postMessage(groupId, message);
      return result;
    } catch (err) {
      throw new Meteor.Error('FB_GRAPH.postToWorkplace', err.message);
    }
  }
});

const Methods = {
  addPhoto,
  postToWorkplace
};

export default Methods