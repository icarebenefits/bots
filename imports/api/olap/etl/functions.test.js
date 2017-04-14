/**
 * Unit test for ETL functions
 */
import {Meteor} from 'meteor/meteor';
import {ETL} from '/imports/api/olap';
// import { expect, be, assert } from 'meteor/practicalmeteor:chai';
import { describe, it } from 'meteor/practicalmeteor:mocha';

if(Meteor.isServer) {
  describe('ETL Functions', function () {
    /**
     * getAliasIndices
     */
    describe('getAliasIndices()', function () {
      it('get exists alias information of country kh', function () {
        const
          country = 'kh',
          {elastic: {indexPrefix: prefix}, public: {env}} = Meteor.settings,
          alias = `${prefix}_${country}_${env}`;
        const res = ETL.getAliasIndices({alias});
        console.log('test', res);
      })
    })
  });
}

