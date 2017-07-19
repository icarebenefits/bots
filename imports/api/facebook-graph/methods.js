import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';

const post = new ValidatedMethod({
  name: 'graph.post',
  validate: new SimpleSchema({
    groupId: {
      type: String
    },
    message: {
      type: String
    },
    picture: {
      type: String,
      optional: true
    }
  }).validator(),
  async run({groupId, message, picture}) {
    try {
      if(!this.isSimulation) {
        console.log('post', groupId, message, picture);
        const {default: Facebook} = require('./functions');

        const result = await Facebook().postMessage(groupId, message, picture);
        return result;
      }
    } catch(err) {
      throw new Meteor.Error('WORKPLACE_POST', err.message);
    }
  }
});

const Methods = {
  post
};

export default Methods