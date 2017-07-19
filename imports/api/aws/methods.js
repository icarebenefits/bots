import {Meteor} from 'meteor/meteor';
import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {check} from 'meteor/check';


const addPhoto = new ValidatedMethod({
  name: 's3.addPhoto',
  validate: null,
  applyOptions: {
    onResultReceived: res => {
      return res;
    }
  },
  run({album, file}) {
    check(album, String);
    check(file, Object);

    try {
      const
        {name, type, body} = file,
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
          return res;
        });
      }
    } catch (err) {
      throw new Meteor.Error('AWS_S3_ADD_PHOTO', err.message);
    }
  }
});

const Methods = {
  addPhoto
};

export default Methods
