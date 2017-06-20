import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check';
import {RFMScoreBoard, RFMTopTen} from '../';

Meteor.publish('rfm.scoreboard', function(country) {
  check(country, String);
  if(!this.userId) {
    return this.ready();
  }
  
  return RFMScoreBoard.find({country});
});

Meteor.publish('rfm.topten', function(country) {
  check(country, String);
  if(!this.userId) {
    return this.ready();
  }

  return RFMTopTen.find({country});
});