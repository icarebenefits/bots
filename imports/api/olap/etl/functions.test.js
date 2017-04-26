// /**
//  * Unit test for ETL functions
//  */
// import {Meteor} from 'meteor/meteor';
// import {ETL} from '/imports/api/olap';
// // import {assert} from 'meteor/practicalmeteor:chai';
// import {describe, it} from 'meteor/practicalmeteor:mocha';
//
// if (Meteor.isServer) {
//   describe('ETL Functions', function () {
//     /**
//      * getAliasIndices
//      */
//     describe('getAliasIndices()', function (done) {
//       it('get exists alias information of country kh', function () {
//         const
//           country = 'kh',
//           {elastic: {indexPrefix: prefix}, public: {env}} = Meteor.settings,
//           alias = `${prefix}_${country}_${env}`;
//         const {indices} = ETL.getAliasIndices({alias});
//         // console.log('indices', indices);
//         // assert(Array.isArray(indices), 'empty arrays are arrays');
//         done();
//       })
//     })
//   });
// }
//
