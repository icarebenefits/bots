import {Meteor} from 'meteor/meteor';
import Countries from '../countries';

Meteor.publish('countries', function() {
  return Countries.find();
});