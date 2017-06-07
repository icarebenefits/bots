import { Meteor } from 'meteor/meteor';
import _ from 'lodash';
import SLAs from '../slas';

Meteor.publish('slasList', function(filter, options) {
  if (!this.userId) {
    return this.ready();
  }
  let selector = {}, modifier = {};

  if(!_.isEmpty(filter)) {
    selector = {...filter};
  }
  if(!_.isEmpty(options)) {
    modifier = {...options};
  }

  return SLAs.find(selector, modifier);
});

