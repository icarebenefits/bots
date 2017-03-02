import {Meteor} from 'meteor/meteor';
import { expect, be, assert } from 'meteor/practicalmeteor:chai';
import { describe, it, before } from 'meteor/practicalmeteor:mocha';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Random } from 'meteor/random';
import {ValidationError} from 'meteor/mdg:validation-error';

import SLAs from '/imports/api/collections/slas/slas';
import '/imports/api/collections/slas/methods';

describe('SLA methods', function() {
  describe('create', function() {
    before(function() {
      resetDatabase();
    });

    it('can create a SLA', function() {
      const sla = {
        name: 'noIcareMember',
        expression: 'count(customers) where icareMember equal 0',
        countries: ['Vietnam']
      };
      Meteor.call('slas.create', sla);
      assert.equal(SLAs.find().count(), 1);
    });

    // it('make sure name of SLA have to be uniqued', function () {
    //   const sla = {
    //     name: 'noIcareMember',
    //     expression: 'count(customers) where icareMember equal 100',
    //     countries: ['Philippines']
    //   };
    //   Meteor.call('slas.create', sla, function() {
    //     assert.throws(() => {
    //       new ValidationError()
    //     });
    //   });
    // });

    it('can not create SLA without country', function() {
      const sla = {
        name: 'noIcareMember',
        expression: 'count(customers) where icareMember equal 0',
      };
      Meteor.call('slas.create', sla, function() {
        assert.throws(() => {
          new ValidationError()
        });
      });
    });
  });

  describe('edit', function() {
    before(function() {
      resetDatabase();
    });

    it('can edit name of SLA which is not exists yet', function() {
      const sla = {
        name: 'DPDInLast6Months',
        expression: 'count(customers) where DPD within now and 6 month',
        countries: ['Vietnam']
      };
      const slaId = Meteor.call('slas.create', sla);

      sla.name = 'DPDInLast7Months';
      Meteor.call('slas.edit', {_id: slaId, name: sla.name});
    });

    it('can not edit name of SLA which is exists', function() {

    });
  });
});

