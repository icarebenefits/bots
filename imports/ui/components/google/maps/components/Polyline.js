import React, {Component, PropTypes} from 'react';

class Polyline extends Component {

  componentDidMount() {
    this._renderPolyline();
  }

  componentDidUpdate(prevProps) {
    if ((this.props.map !== prevProps.map)) {
      if (this.polyline) {
        this.polyline.setMap(null);
        this._renderPolyline();
      }
    }

    if (this.props.visible !== prevProps.visible ||
    this.props.marker !== prevProps.marker) {
      this._renderPolyline();
    }
  }

  componentWillUnmount() {
    if (this.polyline) {
      this.polyline.setMap(null);
    }
  }

  _renderPolyline() {
    const {map, google, markers, marker, markerInfo} = this.props;

    if(!google || !google.maps) {
      return null;
    }

    // examples of coords for polyline
    if(!_.isEmpty(markers)) {
      // clear previous polyline and redraw
      if(this.polyline) {
        this.polyline.setMap(null);
      }

      const coords = this.props.markers
        .filter(m => m.userId === markerInfo.userId)
        .map(m => m.position);
      // coords.push(this.props.markers[0].position);

      const flightPath = this.polyline = new google.maps.Polyline({
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

Polyline.propTypes = {
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

export default Polyline