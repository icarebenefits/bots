import React, {Component, PropTypes} from 'react';

class Polygon extends Component {

  componentDidMount() {
    this._renderPolygon();
  }

  componentDidUpdate(prevProps) {
    if ((this.props.map !== prevProps.map)) {
      if (this.polygon) {
        this.polygon.setMap(null);
        this._renderPolygon();
      }
    }

    if (this.props.visible !== prevProps.visible ) {
      this._renderPolygon();
    }
  }

  componentWillUnmount() {
    if (this.polygon) {
      this.polygon.setMap(null);
    }
  }

  _renderPolygon() {
    const {map, google, data, markers} = this.props;

    if(!google || !google.maps) {
      return null;
    }

    console.log('polygon props', this.props);

    // examples of coords for polyline
    if(!_.isEmpty(markers)) {
      const coords = this.props.markers.map(marker => marker.position);
      // coords.push(this.props.markers[0].position);

      var flightPath = new google.maps.Polyline({
        path: coords,
        geodesic: true,
        strokeColor: '#26C281',
        strokeOpacity: 0.8,
        strokeWeight: 2
      });
      flightPath.setMap(map);
    }
  }

  render() {
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