import {Meteor} from 'meteor/meteor';
import Map, {GoogleApiWrapper, Marker, InfoWindow} from '/imports/ui/google/maps';
import React, {Component, PropTypes} from 'react';
import _ from 'lodash';

// Components
import {Tooltip} from '/imports/ui/components/common';

class GoogleMaps extends Component {
  onClickMap(mapProps, map, clickEvent) {
    console.log('mapProps, map, clickEvent', mapProps, map, clickEvent);
  }

  render() {
    const {markers, infoWindow, onMarkerClick} = this.props;
    return (
      <Map
        google={window.google}
        className={'gmaps'}
        center={{lat: 20.8457926802984, lng: 106.649311603734}}
        containerStyle={{
          position: 'relative',
          height: 500,
          width: '100%'
        }}
        zoom={5}
        onClick={this.onClickMap}
      >
        {!_.isEmpty(markers) &&
          markers.map(marker => (
            <Marker
              {...marker}
              onClick={onMarkerClick}
            />
          ))
        }
        <InfoWindow
          marker={infoWindow.activeMarker}
          visible={infoWindow.showingInfoWindow}>
          <div>
            <Tooltip
              title={infoWindow.selectedPlace.name}
              messages={[
                `Time: ${infoWindow.selectedPlace.time}`,
                `Store: ${infoWindow.selectedPlace.store}`,
                `Email: ${infoWindow.selectedPlace.email}`,
                `User Id: ${infoWindow.selectedPlace.userId}`
              ]}
            />
          </div>
        </InfoWindow>
      </Map>
    );

  }
}

GoogleMaps.propTypes = {
  google: PropTypes.object,
  style: PropTypes.object,
  containerStyle: PropTypes.object,
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  zoom: PropTypes.number,
  markers: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string,
    name: PropTypes.string,
    position: PropTypes.shape({
      lat: PropTypes.float,
      lng: PropTypes.float
    })
  }))
};

export default GoogleApiWrapper({
  apiKey: Meteor.settings.public.google.maps.key,
  version: '3.27'
})(GoogleMaps)