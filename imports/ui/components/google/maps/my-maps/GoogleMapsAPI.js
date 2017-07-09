import {Meteor} from 'meteor/meteor';
import mapsapi from 'google-maps-api';

/**
 *
 * @param props
 * @returns {*}
 * @constructor
 */
const GoogleMapsAPI = (libraries = ['places']) => {
  const {key} = Meteor.settings.public.google.maps;

  return mapsapi(key, libraries)();
};

export default GoogleMapsAPI