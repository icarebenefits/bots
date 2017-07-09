import {Meteor} from 'meteor/meteor';
import React, {Component, PropTypes} from 'react';
import _ from 'lodash';

// Components
import Map, {
  GoogleApiWrapper,
  Marker,
  InfoWindow,
  Polygon
} from '/imports/ui/components/google/maps/google-maps-react';
import {Tooltip} from '/imports/ui/components/common';

class GoogleMaps extends Component {
  render() {
    const {markers, infoWindow, handlers} = this.props;

    return (
      <Map
        google={window.google}
        className={'gmaps'}
        center={{lat: 20.9593855, lng: 107.0157329}}
        containerStyle={{
          position: 'relative',
          height: 500,
          width: '100%'
        }}
        zoom={11}
      >
        {!_.isEmpty(markers) && (
          markers.map((marker, idx) => {
            return (<Marker
              key={idx}
              {...marker}
              {...handlers.marker}
            >
            </Marker>);
          })
        )}
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
        <Polygon
          visible={infoWindow.showingInfoWindow}
          markers={markers}
        />
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
  version: '3.27',
  libraries: ['places', 'drawing', 'geometry', 'visualization']
})(GoogleMaps)