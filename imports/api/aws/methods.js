import {Meteor} from 'meteor/meteor';
import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {check} from 'meteor/check';

const addPhoto = new ValidatedMethod({
  name: 's3.addPhoto',
  validate: new SimpleSchema({
    album: {
      type: String
    },
    file: {
      type: Object
    },
    "file.name": {
      type: String
    },
    "file.body": {
      type: String
    }
  }).validator(),
  run({album, file}) {
    check(album, String);
    check(file, Object);

    try {
      const
        {name, body} = file,
        albumPhotosKey = encodeURIComponent(album),
        photoKey = `${albumPhotosKey}/${name}`;

      if (!name) {
        throw new Meteor.Error('AWS_S3_ADD_PHOTO', 'file.name can not be empty.');
      }
      if (!body) {
        throw new Meteor.Error('AWS_S3_ADD_PHOTO', 'file.body can not be empty');
      }

      if (!this.isSimulation) {
        const {S3} = require('/imports/api/aws');
        if (!S3) {
          throw new Meteor.Error('AWS_S3_ADD_PHOTO', 'AWS S3 service can not be loaded.');
        }

        S3.upload({
          Key: photoKey,
          Body: new Buffer(file.body.replace(/^data:image\/\w+;base64,/, ""), 'base64'),
          ContentEncoding: 'base64',
          ContentType: file.type,
          ACL: 'public-read'
        }, (err, res) => {
          if (err) {
            throw new Meteor.Error('AWS_S3_ADD_PHOTO', err.message);
          }
          console.log('AWS_S3_ADD_PHOTO', res);
          return res;
        });
      }
    } catch (err) {
      throw new Meteor.Error('AWS_S3_ADD_PHOTO', err.message);
    }
  }
});

const deletePhoto = new ValidatedMethod({
  name: 's3.deletePhoto',
  validate: new SimpleSchema({
    album: {
      type: String
    },
    fileName: {
      type: String
    }
  }).validator(),
  run({album, fileName}) {
    check(album, String);
    check(fileName, String);

    try {
      if (!this.isSimulation) {
        const
          albumPhotosKey = encodeURIComponent(album),
          photoKey = `${albumPhotosKey}/${fileName}`,
          {S3} = require('/imports/api/aws');

        if (!S3) {
          throw new Meteor.Error('AWS_S3_DELETE_PHOTO', 'AWS S3 service can not be loaded.');
        }

        S3.deleteObject({
          Key: photoKey
        }, (err, res) => {
          if (err) {
            throw new Meteor.Error('AWS_S3_DELETE_PHOTO', err.message);
          }
          return res;
        });
      }
    } catch (err) {
      throw new Meteor.Error('AWS_S3_DELETE_PHOTO', err.message);
    }
  }
});

const Methods = {
  addPhoto,
  deletePhoto
};

export default Methods
