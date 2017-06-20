/**
 * Unit test for Utils functions
 */
import {Meteor} from 'meteor/meteor';
import {assert} from 'meteor/practicalmeteor:chai';
import {describe, it} from 'meteor/practicalmeteor:mocha';
import {
  Parser,
  cleanupArray
} from '/imports/utils';

if (Meteor.isServer) {
  describe('Utils Functions', function () {
    describe('Parser().indexSuffix()', function () {
      it('return suffix in format YYYY.MM.DD for unit param is day or days', function () {
        const before = '2017.06.13';
        const runDate = new Date(2017, 5, 13);
        let after = Parser().indexSuffix(runDate, 'day').suffix;
        assert.equal(after, before);
        after = Parser().indexSuffix(runDate, 'days').suffix;
        assert.equal(after, before);
      });
      it('return suffix in format YYYY.MM.DD-HH for unit param is hour or hours', function () {
        const before = '2017.06.13-17';
        const runDate = new Date(2017, 5, 13, 17);
        let after = Parser().indexSuffix(runDate, 'hour').suffix;
        assert.equal(after, before);
        after = Parser().indexSuffix(runDate, 'hours').suffix;
        assert.equal(after, before);
      });
      it('return suffix in format YYYY.MM.DD-HH.mm for unit param is minute or minutes', function () {
        const before = '2017.06.13-17.05';
        const runDate = new Date(2017, 5, 13, 17, 5);
        let after = Parser().indexSuffix(runDate, 'minute').suffix;
        assert.equal(after, before);
        after = Parser().indexSuffix(runDate, 'minutes').suffix;
        assert.equal(after, before);
      });
      it('throw error when input unsupported unit', function () {
        const runDate = new Date(2017, 5, 13);

        assert.throws(() => Parser().indexSuffix(runDate, 'second'), Meteor.Error, /Unsupported Unit: second/);
      });
    });
    describe('cleanupArray()', function () {
      it('can remove undefined element', function () {
        const before = [1, undefined, 3, 9, 20];
        const result = [1, 3, 9, 20];
        const after = cleanupArray(before);
        assert.deepEqual(after, result);
      });
      it('can remove null element', function () {
        const before = [1, null, 3, 9, 20];
        const result = [1, 3, 9, 20];
        const after = cleanupArray(before);
        assert.deepEqual(after, result);
      });
      it('can remove empty element', function () {
        const before = [1,, 3,, 9, 20];
        const result = [1, 3, 9, 20];
        const after = cleanupArray(before);
        assert.deepEqual(after, result);
      });
      it('wont remove Number 0 element', function () {
        const before = [1, 0, 3, 9, 20, 0];
        const result = [1, 0, 3, 9, 20, 0];
        const after = cleanupArray(before);
        assert.deepEqual(after, result);
      });
      it('throw error when input is not array', function () {
        const before = 'this is a string';

        assert.throws(() => cleanupArray(before), /Match error: Expected Array/);
      });
    });
  });
}
