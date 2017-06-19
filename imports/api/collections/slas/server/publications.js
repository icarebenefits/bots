import {Meteor} from 'meteor/meteor';
import {check, Match} from 'meteor/check';
import _ from 'lodash';
import SLAs from '../slas';
import {Counts} from 'meteor/tmeasday:publish-counts';

Meteor.publish('slasList', function(filter, search, options) {
  check(filter, Match.Any);
  check(search, Match.Any);
  check(options, Match.Any);
  if (!this.userId) {
    return this.ready();
  }
  let selector = {}, modifier = {};

  if(!_.isEmpty(filter)) {
    selector = {...filter};
  }
  if(!_.isEmpty(search)) {
    selector.searchText = {$regex : `.*${search}.*`};
  }
  if(!_.isEmpty(options)) {
    modifier = {...options};
  }

  Counts.publish(this, 'SLAListCount', SLAs.find(selector));
  return SLAs.find(selector, modifier);
});

