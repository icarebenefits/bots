// import _ from 'lodash';
// import {Migrations} from 'meteor/percolate:migrations';
// import {MSLA} from '/imports/api/collections/monitor-sla';
//
// Migrations.add({
//   version: 2,
//   name: "Create Monitoring SLA",
//   up() {
//     MSLA.insert({
//       name: 'MagentoWebCPU',
//       system: 'magento',
//       service: 'web',
//       metric: 'cpu',
//       conditions: [{value: 25, method: 'sms'}, {value: 24, method: 'email'}, {value: 20, method: 'note'}],
//       noteGroup: 'magento',
//       contacts: ['ZgLZLQcLHC9cs35wQ', 'fBY8rMkoxHPTyhYQN'],
//       status: 'active'
//     });
//   }
// });