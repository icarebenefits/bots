import {Meteor} from 'meteor/meteor';
import AWS from 'aws-sdk';

const {bucketName, region, accessKey: accessKeyId, secretKey: secretAccessKey} = Meteor.settings.aws.s3;

AWS.config.update({
  region,
  accessKeyId,
  secretAccessKey
});

export const S3 = new AWS.S3({
  apiVersion: '2006-03-01',
  params: {Bucket: bucketName}
});

export * from './functions';
import './methods';