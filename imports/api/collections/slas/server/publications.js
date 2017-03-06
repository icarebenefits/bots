import { Meteor } from 'meteor/meteor';
import SLAs from '../slas';

Meteor.publish('slasData', function() {
  // if (!this.userId) {
  //   return this.ready();
  // }

  return SLAs.find();
});