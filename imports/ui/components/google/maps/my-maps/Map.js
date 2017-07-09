import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import mapsapi from 'google-maps-api';

/* Components */
import {Spinner} from '/imports/ui/components/common';
/* Functions */
import GoogleMapsAPI from './GoogleMapsAPI';

const mapStyles = {
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%'
  },
  map: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0
  }
};

class Map extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ready: false,
      currentLocation: {
        lat: this.props.initialCenter.lat,
        lng: this.props.initialCenter.lng
      },
      maps: null,
      map: null
    };

    // private
    this._loadMap = this._loadMap.bind(this);
  }

  componentDidMount() {
    this._loadMap();
  }

  _loadMap() {
    GoogleMapsAPI()
      .then(maps => {
        console.log('maps loaded', maps);
        const
          node = ReactDOM.findDOMNode(this.refs.map),
          zoom = 5,
          curr = this.state.currentLocation,
          center = new maps.LatLng(curr.lat, curr.lng),
          mapTypeId = 'terrain';

        const map = new maps.Map(node, {zoom, center});
        if(map) {
          this.forceUpdate();
        }

        this.setState({
          ready: true,
          maps,
          map
        });
      })
      .catch(err => {
        console.log('maps loaded error', err);
        // Notify error
      })
  }

  _renderChildren() {
    return null;
  }

  render() {
    const style = Object.assign({}, mapStyles.map, this.props.style, {
      display: this.props.visible ? 'inherit' : 'none'
    });

    const containerStyles = Object.assign({},
      mapStyles.container, this.props.containerStyle);

    const {ready} = this.state;
    console.log('ready', ready);
    console.log('state', this.state);
    // if(ready) {
    //   const {maps, map} = this.state;
    //   console.log('maps', maps);
    //   console.log('map', map);
    // }
    return (
      <div style={containerStyles} className={this.props.className}>
        <div style={style} ref='map'>
        </div>
        {this._renderChildren()}
      </div>
    );
  }
}

Map.defaultProps = {
  zoom: 5,
  initialCenter: {
    lat: 37.774929,
    lng: -122.419416
  },
  center: {},
  centerAroundCurrentLocation: false,
  style: {},
  containerStyle: {},
  visible: true
};

Map.propTypes = {};

export default Map