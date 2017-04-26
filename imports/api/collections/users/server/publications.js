import {Meteor} from 'meteor/meteor';

Meteor.publish('activeUsers', function () {
  return Meteor.users.find({}, {fields: {_id: true}});
});