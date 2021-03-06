import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check';
import {Promise} from 'meteor/promise';
import PromiseRequest from 'request-promise';


import Methods from './methods';

const Functions = {};

Functions.getProfile = (_id) => {
  check(_id, String);
  return new Promise((resolve, reject) => {
    Methods.getProfile.call({_id}, (err, res) => {
      if (err) reject(err);
      else resolve(res);
    });
  });
};

Functions.updateToken = (_id, token) => {
  check(_id, String);
  check(token, String);

  return new Promise((resolve, reject) => {
    Methods.updateToken.call({_id, token}, (err, res) => {
      if (err) reject(err);
      else resolve(res);
    });
  });
};

/**
 * Function Promise getAccessToken from an api profile
 * @param {String} profile - profile name to search from Meteor.settings
 * @returns {Promise.<*>}
 */
Functions.getAccessToken = async (profile, _id) => {
  try {
    const options = Meteor.settings.profile[profile];

    const {statusCode, body} = await PromiseRequest(options);
    if (statusCode === 200) {
      if (body) {
        // Add token into API Profile
        await Functions.updateToken(_id, body);
        return body;
      }
    } else {
      // post whole response to workplace
      // await Bots.notifyToAdmin({
      //   title: `API_PROFILE.getAccessToken.${profile}`,
      //   message: `Get access Token failed with statusCode: ${statusCode}, body: ${body}`
      // });
    }
  } catch ({message}) {
    // await Bots.notifyToAdmin({
    //   title: `API_PROFILE.getAccessToken.${profile}`,
    //   message
    // });
    throw new Meteor.Error('API_PROFILE.getAccessToken', message);
  }
};

Functions.callRestApi = async ({profile, options}, count = 0) => {
  try {
    const {statusCode, body} = await PromiseRequest(options);
    if (statusCode === 200) {
      return body;
    } else if (statusCode === 401) {
      // call Rest API again (retry 3 times, if still error then post to admin workplace)
      if (count < 3) {
        count++;
        // call func get Token
        const token = await Functions.getAccessToken({profile});
        if (token) {
          return Functions.callRestApi({profile, options}, count);
        } else {
          // post to workplace
          // await Bots.notifyToAdmin({
          //   title: `API_PROFILE.callRestApi.${profile}`,
          //   message: `Renew token failed ${count} times.`
          // });
        }
      }
    } else {
      // post to workplace whole response message
      // await Bots.notifyToAdmin({
      //   title: `API_PROFILE.callRestApi.${profile}`,
      //   message: `Call Rest API failed with statusCode: ${statusCode}, body: ${body}`
      // });
    }
  } catch ({message}) {
    // await Bots.notifyToAdmin({
    //   title: `API_PROFILE.callRestApi.${profile}.${options.uri}`,
    //   message
    // });
    throw new Meteor.Error('API_PROFILE.callRestApi', message);
  }
};

export default Functions
