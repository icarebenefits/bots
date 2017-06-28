import {Meteor} from 'meteor/meteor';
import {check, Match} from 'meteor/check';
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
      } catch (err) {
        throw new Meteor.Error('FB_GRAPH.getAccessToken', err.message);
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
      } catch (err) {
        throw new Meteor.Error('FB_GRAPH.addMember', err.message);
      }
    },
    getMember: async(memberId) => {
      /* check arguments */
      check(memberId, Match.OneOf(String, Number));

      try {
        const accessToken = await Facebook().getAccessToken();
        const request = {
          method: 'GET',
          url: 'https://www.facebook.com/company/1701882480101071/scim/Users?filter='
          + encodeURIComponent('userName eq "tan.ktm@icarebenefits.com"'),
          // url: prefixUrl + memberId + '?fields=userName,department',
          headers: {
            'User-Agent': 'GKFileAnIssue',
            Accept: 'application/scim+json',
            authorization: 'Bearer '
            + 'DQVJ1a1ljbEJjS3hvNHMybG94MjFHUVp1ZADBUcGx2ZAlFpOTNGRU5NdHM1UE1qTl85RDJPZAXpKbFAtQUNKTGt2cDRjazc2TFZATOVEzNlltRTVlQUtwaHIyZA3Q2eFVtaGpZAZAnVlN0I4VmJubUNabU1WTUdrbVctM2R4cC1jdGluOS1aY1BxSWhyLVFNYi1mc1FfR1o3RV9UNEpacXVYbXZA2Sjdwa0lVRTRkLVNKSGloYzJCSFFuQ0g2Vk8wZAzZAxVkE1R3l4NkNsNHVScW4xXzR0NgZDZD'
          }
        };
        console.log('url', request.url);
        const result = await RequestPromise(request);
        return result;
      } catch (err) {
        throw new Meteor.Error('FB_GRAPH.getMember', err.message);
      }
    },
    getGroup: async(groupId) => {
      /* check arguments */
      check(groupId, Number);

      try {
        const accessToken = await Facebook().getAccessToken();
        const request = {
          method: 'GET',
          url: prefixUrl + groupId,
          headers: {
            authorization: 'Bearer ' + accessToken
          }
        };
        const result = await RequestPromise(request);
        return result;
      } catch (err) {
        throw new Meteor.Error('FB_GRAPH.getGroup', err.message);
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
      } catch (err) {
        throw new Meteor.Error('FB_GRAPH.fetchGroups', err.message);
      }
    },
    postMessage: async(groupId, message) => {
      /* check arguments */
      check(groupId, Match.OneOf(Number, String));
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
      } catch (err) {
        throw new Meteor.Error('FB_GRAPH.postMessage', err.message);
      }
    }
  };
};

export default Facebook

/* Test */
// const moment = require('moment');
// const {facebook: {adminWorkplace}} = Meteor.settings;
// const {formatMessage} = require('/imports/utils/defaults');
// const message = formatMessage({quote: `@Updated on: ${moment().format('LLL')}`});
// Facebook().postMessage(adminWorkplace, message);


// Facebook().getMember(100015320356409)
//   .then(res => console.log('res', res))
//   .catch(err => console.log('err', err));