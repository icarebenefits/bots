import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check';
import request from 'request';
// import {HTTP} from 'meteor/http';

const getToken = (callback) => {
  check(callback, Function);
  const
    {id, secret, username, password, baseUrl, tenant: {Cambodia: tenant}} = Meteor.settings.clients.b2b,
    options = {
      method: 'GET',
      url: `${baseUrl}/oauth/v2/token?client_id=${id}&client_secret=${secret}&grant_type=password&username=${username}&password=${password}`,
      headers: {
        tenant,
        'Accept': '*/*'
      }
    };

  request(options, function (error, response, body) {
    if (error) {
      throw new Meteor.Error('GET_TOKEN_B2B_FAILED');
    }
    console.log({response, body});
    const {statusCode, statusMessage} = response;
    if(statusCode !== 200) {
      throw new Meteor.Error('GET_TOKEN_B2B_FAILED', statusMessage);
    }

    return JSON.parse(body);
  });
};

const client = {
  getToken
};

export default client
