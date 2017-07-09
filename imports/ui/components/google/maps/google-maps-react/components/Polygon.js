import React, {Component, PropTypes} from 'react';

import {wrappedPromise} from '/imports/ui/components/google/maps/google-maps-react';

class Polygon extends Component {

  componentDidMount() {
    this.polygonPromise = wrappedPromise();
    this._renderPolygon();
  }

  componentDidUpdate(prevProps) {
    if ((this.props.map !== prevProps.map)) {
      if (this.polygon) {
        this.polygon.setMap(null);
        this._renderPolygon();
      }
    }
  }

  componentWillUnmount() {
    if (this.polygon) {
      this.polygon.setMap(null);
    }
  }

  _renderPolygon() {
    console.log('_polygon', this.props);
    const {map, google, data} = this.props;

    if(!google || !google.maps) {
      return null;
    }

    console.log('polygon props', this.props);

    // examples of coords for polygon
    const coords = [
      {lat: 20.9593499, lng: 107.0156406},
      {lat: 20.9593966, lng: 107.015727},
      {lat: 20.9593855, lng: 107.015732},
      {lat: 20.9593855, lng: 107.0157329},
      {lat: 20.9593499, lng: 107.0156406}
    ];

    const polygon = this.polygon = new google.maps.Polygon({
      paths: coords,
      strokeColor: '#32C5D2',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#32C5D2',
      fillOpacity: 0.35
    });

    console.log('polygon', polygon);

    this.polygonPromise.resolve(this.polygon);
  }

  render() {
    console.log('render polygon', this.props);
    return null;
  }
}

Polygon.propTypes = {
  coords: PropTypes.arrayOf(PropTypes.shape({
    lat: PropTypes.number,
    lng: PropTypes.number
  })),
  options: PropTypes.shape({
    strokeColor: PropTypes.string,
    strokeOpacity: PropTypes.number,
    strokeWeight: PropTypes.number,
    fillColor: PropTypes.string,
    fillOpacity: PropTypes.number
  })
};

export default Polygon