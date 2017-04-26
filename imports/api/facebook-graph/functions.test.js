import {Meteor} from 'meteor/meteor';
import {assert} from 'meteor/practicalmeteor:chai';
import {describe, it} from 'meteor/practicalmeteor:mocha';

/* Functions */
import {Facebook} from '/imports/api/facebook-graph';

if (Meteor.isServer) {
  describe('Facebook Graph API', function () {
    /* get access token */
    describe('getAccessToken', function (done) {
      it('can get the access token from facebook graph', function () {
        Facebook().getAccessToken()
          .then(token => {
            assert.isString(token, 'token received');
            done();
          })
          .catch(err => {
            assert.fail(err);
            done();
          });
      });
    });

    /* post message to workplace */
    describe('postMessage', function (done) {
      it('can post a message into a group on fb@work', function () {
        const {adminWorkplace} = Meteor.settings.facebook;
        Facebook().postMessage(adminWorkplace, `# TestCase: \n **Post a message** \n \`\`\` \n Message is posted.`)
          .then(({id}) => {
            assert.isOk(id);
            done();
          })
          .catch(err => {
            assert.fail(err);
            done();
          });
      });
    });

    /* fetch workplace groups */
    describe('fetchGroups', function (done) {
      it('can fetch groups from fb@work', function () {
        Facebook().fetchGroups()
          .then(({data}) => {
            assert.isArray(data, 'received array of groups.');
            done();
          })
          .catch(err => {
            assert.fail(err);
            done();
          });
      });
    });
  });
}
