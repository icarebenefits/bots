/**
 * Created by vinhcq on 3/6/17.
 */

import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {check} from 'meteor/check';
import {FbRequest} from '/imports/api/facebook'

export const WorkplaceGroups = new Mongo.Collection('workplaces');

if (Meteor.isServer) {
  // This code only runs on the server

  Meteor.publish('groups', function () {

    return WorkplaceGroups.find({}, {sort: {createdAt: -1}});
  });

}


Meteor.methods({

  'groups.insert'({groupId, groupName, country}) {
    console.log(groupName);
    console.log(groupId);
    console.log(country);
    check(groupName, String);

    WorkplaceGroups.insert({
      id: groupId,
      createdAt: new Date(),
      name: groupName,
      country: country,

    });

  },

  'groups.getName': function (groupId) {
    console.log("groupId:", groupId);
    let result = {};
    if (!this.isSimulation) {
      const fb = new FbRequest();
      const parseBody = JSON.parse(fb.validateSync(groupId).body);
      if (parseBody.error) {
        result = {
          error: "not_found_group_id",
          message: "not found group id:" + groupId
        }
      } else {
        if (parseBody.privacy) {
          result = parseBody;
        } else result = {
          error: "invalid_group_id",
          message: groupId + " is INVALID group id"
        }
      }
    }
    return result;
  },

  'groups.fetchFB': (groupId) => {
    let result = {};
    if (!this.isSimulation) {
      console.log('groupId', groupId);
      const fb = new FbRequest();
      const FBValidateSync = Meteor.wrapAsync(fb.validateAsync);
      const validateResult = FBValidateSync(groupId).body;
      console.log('body', validateResult);
      result = validateResult;
    }
    return result;
  },

  'groups.remove'(id) {
    check(id, String);
    WorkplaceGroups.remove(id);

  },


});