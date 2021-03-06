import {Meteor} from 'meteor/meteor';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {LoggedInMixin} from 'meteor/tunifight:loggedin-mixin';
import _ from 'lodash';
import ApiProfile from './api-profile';

const Methods = {};

/**
 * Definition for Mixins which will be applied for API Profile Methods
 */
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


/**
 * Method get profile base on _id (client - server)
 * @param {String} _id
 */
Methods.getProfile = new ValidatedMethod({
  name: 'api_profile.getProfile',
  validate: new SimpleSchema({
    _id: {
      type: String,
      regEx: SimpleSchema.RegEx.Id
    }
  }).validator(),
  run({_id}) {
    try {
      const result = ApiProfile.findOne({_id});
      return result;
    } catch(err) {
      throw new Meteor.Error('API_PROFILE.getProfile', err.message);
    }
  }
});

/**
 * Method get all Profiles which defined in Meteor.settings (client - server)
 */
Methods.getAllProfiles = new ValidatedMethod({
  name: 'api_profile.getAllProfiles',
  ...mixins,
  validate: null,
  run() {
    try {
      if (!this.isSimulation) {
        const {profile} = Meteor.settings;
        let profiles = [{name: '', label: ''}];

        if (!_.isEmpty(profile)) {
          profiles = Object.keys(profile).map(p => ({name: p, label: p}));
        }

        return {profiles};
      }
    } catch (err) {
      throw new Meteor.Error('API_PROFILE.getAllProfiles', err.message);
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

/**
 * Method update Token for a profile (client - server)
 * @param {String} _id
 * @param {String} token
 */
Methods.updateToken = new ValidatedMethod({
  name: 'api_profile.updateToken',
  validate: new SimpleSchema({
    _id: {
      type: String,
      regEx: SimpleSchema.RegEx.Id
    },
    token: {
      type: String
    }
  }).validator(),
  run({_id, token}) {
    try {
      const result = ApiProfile.update({_id}, {$set: {token}});
      return result;
    } catch(err) {
      throw new Meteor.Error('API_PROFILE.updateToken', err.message);
    }
  }
});

/**
 * Method Remove API Profile (client - server)
 * @param {String} _id
 */
Methods.remove = new ValidatedMethod({
  name: 'api_profile.remove',
  ...mixins,
  validate: new SimpleSchema({
    _id: {
      type: String,
      regEx: SimpleSchema.RegEx.Id
    }
  }).validator(),
  run({_id}) {
    try {
      const result = ApiProfile.remove({_id});
      return result;
    } catch(err) {
      throw new Meteor.Error('API_PROFILE.remove', err.message);
    }
  }
});

export default Methods