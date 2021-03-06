import {Meteor} from 'meteor/meteor';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

// Components
import {Spinner} from '/imports/ui/components/common';
import {
  GoogleApiWrapper,
  Map,
  Marker,
  InfoWindow,
  Polyline,
  MarkerCluster
} from '/imports/ui/components/google/maps/index';
import {Tooltip} from '/imports/ui/components/common';

class GoogleMaps extends Component {
  render() {
    const {
      ready,
      center, zoom, height = 500,
      markers, activeMarker, activeMarkerId,
      showInfoWindow, showPolyline,
      handlers
    } = this.props;

    if(ready) {
      return (
        <Map
          google={window.google}
          ref="map"
          className={'gmaps'}
          center={center || {lat: 16.002808, lng: 105.488322}}
          containerStyle={{
            position: 'relative',
            height,
            width: '100%'
          }}
          zoom={zoom || 5}
        >
          <MarkerCluster
            options={{gridSize: 50, maxZoom: 15}}
            markers={markers}
          >
            {!_.isEmpty(markers) && (
              markers.map((marker, idx) => {
                return (<Marker
                  key={idx}
                  {...marker}
                  {...handlers}
                >
                </Marker>);
              })
            )}
          </MarkerCluster>
          <InfoWindow
            marker={activeMarker.marker}
            visible={showInfoWindow}>
            <div>
              <Tooltip
                title={activeMarker.info.name}
                messages={[
                  `Time: ${activeMarker.info.time}`,
                  `Store: ${activeMarker.info.store}`,
                  `Email: ${activeMarker.info.email}`,
                  `User Id: ${activeMarker.info.userId}`
                ]}
              />
            </div>
          </InfoWindow>
          <Polyline
            visible={showPolyline}
            markers={markers}
            markerId={activeMarkerId}
          />
        </Map>
      );
    } else {
      return (
        <Spinner/>
      );
    }

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