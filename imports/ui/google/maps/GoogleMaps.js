import {Meteor} from 'meteor/meteor';
import Map, {GoogleApiWrapper, Marker} from '/imports/ui/google/maps';
import React, {Component, PropTypes} from 'react';

class GoogleMaps extends Component {
   onClickMap(mapProps, map, clickEvent) {
     console.log('mapProps, map, clickEvent', mapProps, map, clickEvent);
   }

  render() {
    return (
      <Map
        google={window.google}
        className={'gmaps'}
        center={{lat: 11.5827863550617, lng: 104.887336468669}}
        containerStyle={{
          position: 'relative',
          height: 500,
          width: '100%'
        }}
        zoom={14}
        onClick={this.onClickMap}
      >
        <Marker
          title={'The marker`s title will appear as a tooltip.'}
          name={'SOMA'}
          position={{lat: 11.5827863550617, lng: 104.887336468669}} />
      </Map>
    );

  }
}

GoogleMaps.propTypes = {
  google: PropTypes.object,
  style: PropTypes.object,
  containerStyle: PropTypes.object,
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  zoom: PropTypes.number
};

export default GoogleApiWrapper({
  apiKey: Meteor.settings.public.google.maps.key,
  version: '3.27'
})(GoogleMaps)