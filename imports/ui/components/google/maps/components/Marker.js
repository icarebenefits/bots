import React from 'react';
import PropTypes from 'prop-types';
import S from 'string';

import {wrappedPromise} from '/imports/ui/components/google/maps';
const evtNames = ['click', 'mouseover', 'mouseout', 'recenter', 'dragend'];

class Marker extends React.Component {

  componentDidMount() {
    this.markerPromise = wrappedPromise();
    this.renderMarker();
  }

  componentDidUpdate(prevProps) {
    if (this.props.map !== prevProps.map ||
      this.props.position !== prevProps.position ||
      this.props.MarkerCluster !== prevProps.MarkerCluster) {
      if (this.marker) {
        this.marker.setMap(null);
      }
      this.renderMarker();
    }
  }

  componentWillUnmount() {
    if (this.marker) {
      this.marker.setMap(null);
    }
  }

  renderMarker() {
    let {
      map, google, position, mapCenter,
      icon, label, draggable, title,
      MarkerCluster
    } = this.props;
    if (!google) {
      return null
    }

    let pos = position || mapCenter;
    if (!(pos instanceof google.maps.LatLng)) {
      position = new google.maps.LatLng(pos.lat, pos.lng);
    }

    const pref = {
      map: map,
      position: position,
      icon: icon,
      label: label,
      title: title,
      draggable: draggable
    };
    this.marker = new google.maps.Marker(pref);

    if (MarkerCluster) {
      MarkerCluster.addMarker(this.marker);
    }

    evtNames.forEach(e => {
      this.marker.addListener(e, this.handleEvent(e));
    });

    this.markerPromise.resolve(this.marker);
  }

  getMarker() {
    return this.markerPromise;
  }

  handleEvent(evt) {
    return (e) => {
      const evtName = `on${S(evt).capitalize().s}`;
      if (this.props[evtName]) {
        this.props[evtName](this.props, this.marker, e);
      }
    }
  }

  render() {
    return null;
  }
}

Marker.propTypes = {
  position: PropTypes.object,
  map: PropTypes.object
}

evtNames.forEach(e => Marker.propTypes[e] = PropTypes.func)

Marker.defaultProps = {
  name: 'Marker'
}

export default Marker
