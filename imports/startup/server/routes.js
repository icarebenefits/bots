// import {Restivus} from 'meteor/nimble:restivus';
//
// const API = new Restivus({
//   apiPath: 'rest/',
//   useDefaultAuth: true,
//   prettyJson: true
// });
//
// API.addRoute('api/:action', {authRequired: true}, {
//   post: {
//     action: function () {
//       const
//         {action} = this.urlParams,
//         {userId, mailgunId, email, reason, date} = this.bodyParams
//         ;
//       let message = "";
//
//       switch (action) {
//         case "disableAccount": {
//           return disableAccount.call({userId, mailgunId, email, reason, date});
//           break;
//         }
//         case "enableAccount": {
//           return enableAccount.call({userId, mailgunId, email, reason, date});
//           break;
//         }
//         case "disableEmployee": {
//           return disableEmployee({userId, mailgunId, email, reason, date});
//           break;
//         }
//         case "enableEmployee": {
//           return enableEmployee({userId, mailgunId, email, reason, date});
//           break;
//         }
//         default: {
//           message = `Unknown api ${action}.`;
//           return {
//             statusCode: 404,
//             headers: {
//               'Content-Type': 'text/plain'
//             },
//             body: message
//           };
//         }
//       }
//       return "ok";
//     }
//   }
// });