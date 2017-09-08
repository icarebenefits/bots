import {Meteor} from 'meteor/meteor';
import {Roles} from 'meteor/alanning:roles';
import ApiProfile from '../api-profile';
import {Counts} from 'meteor/tmeasday:publish-counts';

Meteor.publish('api_profile_list', function() {
  if (!this.userId || !Roles.userIsInRole(this.userId, ['super-admin'])) {
    return this.ready();
  }

  Counts.publish(this, 'api_profile_list_count', ApiProfile.find());
  return ApiProfile.find();
});

