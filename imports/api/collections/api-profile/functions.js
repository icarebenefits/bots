import {Promise} from 'meteor/promise';
import Methods from './methods';

const Functions = {};

Functions.getProfile = (_id) => {
  return new Promise((resolve, reject) => {
    Methods.getProfile.call({_id}, (err, res) => {
      if(err) reject(err);
      else resolve(res);
    });
  });
};

export default Functions
