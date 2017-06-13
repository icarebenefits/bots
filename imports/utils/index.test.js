/**
 * Unit test for Utils functions
 */
import {Meteor} from 'meteor/meteor';
import {assert} from 'meteor/practicalmeteor:chai';
import {describe, it} from 'meteor/practicalmeteor:mocha';
import {getIndexSuffix} from '/imports/utils';

if (Meteor.isServer) {
  describe('Utils Functions', function () {
    describe('getIndexSuffix()', function () {
      it('return suffix in format YYYY.MM.DD for unit param is day or days', function () {
        const before = '2017.06.13';
        const runDate = new Date(2017, 5, 13);
        let after = getIndexSuffix(runDate, 'day').suffix;
        assert.equal(after, before);
        after = getIndexSuffix(runDate, 'days').suffix;
        assert.equal(after, before);
      });
      it('return suffix in format YYYY.MM.DD-HH for unit param is hour or hours', function () {
        const before = '2017.06.13-17';
        const runDate = new Date(2017, 5, 13, 17);
        let after = getIndexSuffix(runDate, 'hour').suffix;
        assert.equal(after, before);
        after = getIndexSuffix(runDate, 'hours').suffix;
        assert.equal(after, before);
      });
      it('return suffix in format YYYY.MM.DD-HH.mm for unit param is minute or minutes', function () {
        const before = '2017.06.13-17.05';
        const runDate = new Date(2017, 5, 13, 17, 5);
        let after = getIndexSuffix(runDate, 'minute').suffix;
        assert.equal(after, before);
        after = getIndexSuffix(runDate, 'minutes').suffix;
        assert.equal(after, before);
      });
      it('throw error when input unsupported unit', function() {
        const before = '2017.06.13';
        const runDate = new Date(2017, 5, 13);

        assert.throws(() => getIndexSuffix(runDate, 'second'), Meteor.Error, /Unsupported Unit: second/);
      });
    });
  });
}
