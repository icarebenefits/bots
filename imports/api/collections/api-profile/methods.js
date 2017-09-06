import {Meteor} from 'meteor/meteor';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {LoggedInMixin} from 'meteor/tunifight:loggedin-mixin';
import _ from 'lodash';
import ApiProfile from './api-profile';

const Methods = {};

const mixins = {
  mixins: [LoggedInMixin],
  checkRoles: {
    roles: ['super-admin'],
    rolesError: {
      error: 'not-allowed',
      message: 'You are not allowed to call this method',//Optional
      reason: 'You are not allowed to call this method' //Optional
    }
  },
  checkLoggedInError: {
    error: 'notLogged',
    message: 'You need to be logged in to call this method',//Optional
    reason: 'You need to login' //Optional
  }
};

Methods.getProfile = new ValidatedMethod({
  name: 'api_profile.getProfile',
  ...mixins,
  validate: null,
  run() {
    try {
      if (!this.isSimulation) {
        const {profile} = Meteor.settings;
        let profiles = [];

        if (!_.isEmpty(profile)) {
          profiles = Object.keys(profile).map(p => ({name: p, label: p}));
        }

        return {profiles};
      }
    } catch (err) {
      throw new Meteor.Error('API_PROFILE.getProfile', err.message);
    }
  }
});

/**
 * Method Create API Profile (client - server)
 * User have to be logged in & be a super-admin to call this method
 * @param {String} name
 * @param {String} description
 * @param {String} endPoint
 * @param {Object} authen - username, password, token
 * @param {String} status
 */
Methods.create = new ValidatedMethod({
  name: 'api_profile.create',
  ...mixins,
  validate: new SimpleSchema({
    name: {
      type: String
    },
    profile: {
      type: String
    },
    endpoint: {
      type: String,
      regEx: SimpleSchema.RegEx.Url
    },
    token: {
      type: String,
      optional: true
    }
  }).validator(),
  run({name, profile, endpoint}) {
    try {
      const result = ApiProfile.insert({name, profile, endpoint});
      return result;
    } catch (err) {
      throw new Meteor.Error('API_PROFILE.create', err.message);
    }
  }
});

export default Methods