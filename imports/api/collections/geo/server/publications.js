import {Meteor} from 'meteor/meteor';
import {check, Match} from 'meteor/check';
import _ from 'lodash';
import GEO_SLA from '../geo';

Meteor.publish('geoSLAList', function() {
  if (!this.userId) {
    return this.ready();
  }

  return GEO_SLA.find();
});

