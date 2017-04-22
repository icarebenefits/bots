import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check';
import RequestPromise from 'request-promise';

const Facebook = () => {
  const {personalId, appToken, prefixUrl} = Meteor.settings.facebook;

  return {
    getAccessToken: async() => {
      const request = {
        method: 'GET',
        url: prefixUrl + personalId,
        qs: {fields: 'impersonate_token'},
        headers: {
          authorization: 'Bearer ' + appToken
        }
      };

      try {
        const result = await RequestPromise(request);
        return JSON.parse(result).impersonate_token;
      } catch (e) {
        throw new Meteor.Error('getAccessToken', JSON.stringify(e));
      }
    },
    addMember: async(groupId) => {
      /* check arguments */
      check(groupId, Number);

      const {bots: member} = Meteor.settings.facebook;
      try {
        const accessToken = await Facebook().getAccessToken();
        const request = {
          method: 'POST',
          url: prefixUrl + groupId + "/members?email=" + encodeURIComponent(member),
          // url: prefixUrl + groupId + "/members",
          headers: {
            authorization: 'Bearer ' + accessToken
          }
        };
        const result = await RequestPromise(request);
        return result;
      } catch (e) {
        throw new Meteor.Error('addMember', JSON.stringify(e));
      }
    },
    postMessage: async(groupId, message) => {
      /* check arguments */
      check(groupId, Number);
      check(message, String);

      try {
        const accessToken = await Facebook().getAccessToken();
        const request = {
          method: 'POST',
          url: prefixUrl + groupId + "/feed",
          headers: {
            authorization: 'Bearer ' + accessToken
          },
          body: {
            message,
            "type": "status",
            formatting: "MARKDOWN"
          },
          json: true
        };
        const result = await RequestPromise(request);
        return result;
      } catch (e) {
        throw new Meteor.Error('postMessage', JSON.stringify(e));
      }
    },
    fetchGroups: async(next) => {
      try {
        let url = '';
        if (next) {
          url = next;
        } else {
          url = prefixUrl + "/community/groups";
        }
        const accessToken = await Facebook().getAccessToken();
        const request = {
          method: 'GET',
          url,
          headers: {
            authorization: 'Bearer ' + accessToken
          }
        };
        const result = await RequestPromise(request);
        return result;
      } catch (e) {
        throw new Meteor.Error('postMessage', JSON.stringify(e));
      }
    }
  };
};

export default Facebook