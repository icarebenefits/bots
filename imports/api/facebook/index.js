import request from "request";
import {Meteor} from 'meteor/meteor';

export function FbRequest() {
}

FbRequest.prototype = {
  post: function (personalId, groupId, message) {
    const app_token = Meteor.settings.facebook.appToken;
    const prefix_url = Meteor.settings.facebook.prefixUrl;
    const options = {
      method: 'GET',
      url: prefix_url + personalId,
      qs: {fields: 'impersonate_token'},
      headers: {
        authorization: 'Bearer ' + app_token
      }
    };

    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      const obj = JSON.parse(body);

      const impersonate_token = obj.impersonate_token;
      const options = {
        method: 'POST',
        url: prefix_url + groupId + "/feed",
        headers: {
          authorization: 'Bearer ' + impersonate_token
        },
        body: {
          "message": message,
          "type": "status"
        },
        json: true
      };
      request(options, function (error, response, body) {
        if (error) throw new Error(error);

        console.log(body);
      });
    });
  },

  validateAsync: function (groupId, callback) {
    const app_token = Meteor.settings.facebook.appToken;
    const prefix_url = Meteor.settings.facebook.prefixUrl;

    const options = {
      method: 'GET',
      url: prefix_url + groupId,
      headers: {
        authorization: 'Bearer ' + app_token
      }
    };

    request(options, callback);
  },

  validateSync: function (groupId) {
    const FBValidateSync = Meteor.wrapAsync(this.validateAsync);
    return FBValidateSync(groupId);
  }
};

// //test only
// const fbRequest = new FbRequest("hello",  257279828017220, 100015398923627);
// fbRequest.post();
// const fbRequest = new FbRequest();
// fbRequest.validateSync("257279828017220", function (error, response, body) {
//   if (error) throw new Error(error);
//   console.log(body);
// });
