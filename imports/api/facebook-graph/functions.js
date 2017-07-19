import {Meteor} from 'meteor/meteor';
import {check, Match} from 'meteor/check';
import RequestPromise from 'request-promise';
import validate from 'validate.js';

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
    getMember: async(email) => {
      /* check arguments */
      check(email, Match.OneOf(String, Number));

      try {
        /* Validate Email */
        const constraints = {
          email: {
            email: true
          }
        };
        const validation = validate({email}, constraints);
        if(validation) {
          throw new Meteor.Error('VALIDATE_EMAIL', validation.email[0]);
        }
        
        const request = {
          method: 'GET',
          url: 'https://www.facebook.com/company/1701882480101071/scim/Users?filter='
          + encodeURIComponent(`userName eq "${email.toLowerCase()}"`),
          headers: {
            'User-Agent': 'iCare Bots',
            Accept: 'application/scim+json',
            authorization: 'Bearer ' + appToken
          }
        };
        const result = await RequestPromise(request);
        if(!_.isEmpty(result)) {
          const {totalResults} = JSON.parse(result);
          if(totalResults > 0) {
            // only return first member received
            const {Resources: [member]} = JSON.parse(result);
            const {id, userName} = member;
            return {id, userName};
          }
        }
        return {};
      } catch (err) {
        throw new Meteor.Error('FB_GRAPH.getMember', err.message);
      }
    },
    tagMember: async(message, email) => {
      check(message, String);
      check(email, String);
      
      try {
        /* Validate Email */
        const constraints = {
          email: {
            email: true
          }
        };
        const validation = validate({email}, constraints);
        if(validation) {
          // validation err will return the current message
          return message;
        }

        let resMessage = message;
        const member = await Facebook().getMember(email);
        if(!_.isEmpty(member)) {
          const {id} = member;
          if(id) {
            resMessage += ` @[${id}]`;
          }
        }
        return resMessage;
      } catch(err) {
        throw new Meteor.Error('FB_GRAPH.tagMember', err.message);
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
    postMessage: async(groupId, message, picture) => {
      /* check arguments */
      check(groupId, Match.OneOf(Number, String));
      check(message, String);
      check(picture, Match.Maybe(String));

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
            link: picture,
            "type": "status",
            formatting: "MARKDOWN"
          },
          json: true
        };
        console.log('postMessage', request);
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

// const email = 'chris@icarebenefits.com';
// Facebook().getMember(email)
//   .then(res => console.log('res', res))
//   .catch(err => console.log('err', err));