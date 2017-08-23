// import {Restivus} from 'meteor/nimble:restivus';
// import {Buffer} from 'buffer';
//
// const API = new Restivus({
//   apiPath: 'rest/',
//   useDefaultAuth: true,
//   prettyJson: true
// });
//
// API.addRoute('notification', {authRequired: true}, {
//   post: {
//     action: function () {
//       // const
//       // {action} = this.urlParams,
//       // {userId, mailgunId, email, reason, date} = this.bodyParams
//       // ;
//
//       // content of message posted from AWS SNS
//       const content = Buffer(this.request._readableState.buffer[0]).toString();
//       if(content) {
//         console.log('content', JSON.parse(content));
//         const {Type, MessageId, TopicArn, Subject, Message, Timestamp, SignatureVersion, Signature, SigningCertURL, UnbuscribeURL} = JSON.parse(content);
//         if(Message) {
//           const {AlarmName, AlarmDescription, AWSAccountId, NewStateValue, NewStateReason, StateChangeTime, Region, OldStateValue, Trigger} = JSON.parse(Message);
//           console.log('message', {AlarmName, AlarmDescription, AWSAccountId, NewStateValue, NewStateReason, StateChangeTime, Region, OldStateValue, Trigger});
//
//           /* send SMS Alert */
//           const AWS = require('aws-sdk');
//
//           AWS.config.update({
//             region: 'ap-southeast-1',
//             accessKeyId: 'AKIAIVBCTJRAT3UBTINQ',
//             secretAccessKey: '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'
//           });
//           const sns = new AWS.SNS();
//           const params = {
//             Message: 'this is disaster', /* required */
//             Subject: Subject,
//             TopicArn: 'arn:aws:sns:ap-southeast-1:011019559463:alarm_email_general'
//           };
//           // sns.checkIfPhoneNumberIsOptedOut({
//           //   phoneNumber: 'STRING_VALUE' /* required */
//           // }, function(err, data) {
//           //   if (err) console.log(err, err.stack); // an error occurred
//           //   else     console.log(data);           // successful response
//           // });
//           sns.publish(params, function(err, data) {
//             if (err) console.log('error', err, err.stack); // an error occurred
//             else     console.log('success', data);           // successful response
//           });
//
//           /* Send SMS with Brand name of MOBIVI - very expensive */
//           // const request = require('request');
//           // const result = request.post({
//           //   url: 'https://queue.icarebenefits.vn/mca-rest/message/send.json',
//           //   auth: {
//           //     user: 'mbvsendmessage',
//           //     pass: 'q12awdfsdcq12'
//           //   },
//           //   json: true,
//           //   body: {
//           //     to: '01264689848',
//           //     type: 'text/outgoing-sms',
//           //     body: 'Bots test alarm by SMS'
//           //   }
//           // });
//           // console.log('send sms', result);
//         }
//       }
//
//       return "ok";
//     }
//   },
//   get: {
//     action: function() {
//       console.log('this', this);
//       return "ok";
//     }
//   }
// });