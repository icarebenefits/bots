import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check';
import {S3} from './';

/**
 * Create S3 Album
 * @param albumName
 * @param callback
 */
export const createAlbum = (albumName, callback) => {
  check(albumName, String);
  albumName = albumName.trim();

  if (!albumName) {
    callback(new Meteor.Error('AWS_S3_CREATE_ALBUM', 'Album names must contain at least one non-space character.'));
  }
  if (albumName.indexOf('/') !== -1) {
    callback(new Meteor.Error('AWS_S3_CREATE_ALBUM', 'Album names cannot contain slashes.'));
  }

  const albumKey = encodeURIComponent(albumName) + '/';
  S3.headObject({Key: albumKey}, function(err, data) {
    console.log('S3 headObject', data);
    if (!err) {
      throw new Meteor.Error('AWS_S3_CREATE_ALBUM', 'Album already exists.');
    }
    if (err.code !== 'NotFound') {
      throw new Meteor.Error('AWS_S3_CREATE_ALBUM', 'There was an error creating your album: ' + err.message);
    }
    S3.putObject({Key: albumKey}, function(err, data) {
      if (err) {
        throw new Meteor.Error('AWS_S3_CREATE_ALBUM', 'There was an error creating your album: ' + err.message);
      }
      console.log('AWS_S3_CREATE_ALBUM.SUCCESS', data);
      return {
        album: data
      };
    });
  });
};

/**
 *
 */
export const getLists = () => {
  const params = {
    Bucket: 'icbbots-stage',
    MaxKeys: 2
  };

  S3.listObjects(params, (err, res) => {
    if(err) {
      return console.log('getList', err);
    }
    return console.log('getList', res);
  });
};

/**
 * Delete photo in S3
 * @param photoKey
 */
export const deletePhoto = (photoKey = 'images/fs_location_canvas.png') => {
  S3.deleteObject({Key: photoKey}, function(err, data) {
    if (err) {
      return console.log('There was an error deleting your photo: ', err.message);
    }
    console.log('Successfully deleted photo.', data);

  });
};