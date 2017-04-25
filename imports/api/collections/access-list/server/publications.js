import {Meteor} from 'meteor/meteor';
import {AccessList} from '../';

Meteor.publish('access.list', function() {
  const publicFields = {
    email: true,
    createdAt: true,
    updatedAt: true,
  };
  
  return AccessList.find({}, {fields: {...publicFields}});
});