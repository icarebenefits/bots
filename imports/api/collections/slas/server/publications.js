import { Meteor } from 'meteor/meteor';
import SLAs from '../slas';

Meteor.publish('slasList', function() {
  // if (!this.userId) {
  //   return this.ready();
  // }

  return SLAs.find();
});

