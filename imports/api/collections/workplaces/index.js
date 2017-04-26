import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {check} from 'meteor/check';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

/* Functions */
import {FbRequest} from '/imports/api/facebook-graph/index.old';

export const WorkplaceGroups = new Mongo.Collection('workplaces');

WorkplaceGroups.schema = new SimpleSchema({
  id: {
    type: Number,
  },
  name: {
    type: String
  },
  createdAt: {
    type: Date,
  },
  country: {
    type: String
  }
});

WorkplaceGroups.attachSchema(WorkplaceGroups.schema);

if (Meteor.isServer) {
  // This code only runs on the server

  Meteor.publish('groups', function () {
    const publicFields = {
      id: true,
      name: true,
      createdAt: true,
      country: true,
    };

    return WorkplaceGroups.find({}, {fields: {...publicFields}});
  });

}


Meteor.methods({

  'groups.insert'({groupId, groupName, country}) {
    check(groupName, String);
    check(groupName, String);
    check(country, String);

    try {
      const result = WorkplaceGroups.insert({
        id: groupId,
        createdAt: new Date(),
        name: groupName,
        country: country,
      });
      return result;
    } catch (e) {
      throw new Meteor.Error('groups.insert', JSON.stringify(e));
    }

  },

  'groups.getName': function (groupId) {
    check(groupId, Number);
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
    check(groupId, String);
    let result = {};
    if (!this.isSimulation) {
      const fb = new FbRequest();
      const FBValidateSync = Meteor.wrapAsync(fb.validateAsync);
      const validateResult = FBValidateSync(groupId).body;
      result = validateResult;
    }
    return result;
  },

  'groups.remove': ({_id}) => {
    check(_id, String);
    WorkplaceGroups.remove({_id});

  },


});