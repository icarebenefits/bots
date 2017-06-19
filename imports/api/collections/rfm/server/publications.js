import {Meteor} from 'meteor/meteor';
import {RFMScoreBoard, RFMTopTen} from '../';

Meteor.publish('rfm.scoreboard', function(country) {
  if(!this.userId) {
    return this.ready();
  }
  
  return RFMScoreBoard.find({country});
});

Meteor.publish('rfm.topten', function(country) {
  if(!this.userId) {
    return this.ready();
  }

  return RFMTopTen.find({country});
});