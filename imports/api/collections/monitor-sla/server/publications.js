import {Meteor} from 'meteor/meteor';
import MSLA from '../monitor-sla';
import {Counts} from 'meteor/tmeasday:publish-counts';

Meteor.publish('monitor_sla_list', function() {
  if (!this.userId) {
    return this.ready();
  }

  Counts.publish(this, 'monitor_sla_list_count', MSLA.find());
  return MSLA.find();
});

