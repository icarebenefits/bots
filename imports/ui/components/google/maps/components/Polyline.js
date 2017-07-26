import React, {Component} from 'react';
import PropTypes from 'prop-types';

class Polyline extends Component {

  componentDidMount() {
    this._renderPolyline();
  }

  componentDidUpdate(prevProps) {
    if ((this.props.map !== prevProps.map)) {
      if (this.polyline && this.props.map) {
        this.polyline.setMap(null);
        this._renderPolyline();
      }
    }

    if (this.props.visible !== prevProps.visible ||
    this.props.markerId !== prevProps.markerId) {
      this._renderPolyline();
    }
  }

  componentWillUnmount() {
    if (this.polyline) {
      this.polyline.setMap(null);
    }
  }

  _renderPolyline() {
    const {map, google, markers, markerId} = this.props;

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
        .filter(m => m.userId === Number(markerId))
        .map(m => m.position);

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
  }),
  markerId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};

export default Polyline