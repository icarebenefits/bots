import { describe, it } from 'meteor/practicalmeteor:mocha';

/**
 * Unit tests for polish notation functions
 */

describe('Query Builder', function() {
  describe('polishNotation()', function() {
    describe('empty condition', function() {
      it("should return a search all query", function() {

      });
    });
    
    describe('has 1 condition', function() {
      describe('content is empty', function () {
        it("should return a search all query", function() {

        });
      });

      describe('condition is date field', function () {
        it("should return a search range query", function() {

        });
      });
      describe('condition is number field', function () {
        it("should return a search range query", function() {

        });
      });
    });
  });
});