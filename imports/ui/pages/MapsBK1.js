import {Meteor} from 'meteor/meteor';
import React, {Component, PropTypes} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import bodybuilder from 'bodybuilder';
import moment from 'moment';
import S from 'string';

// Components
import {Spinner} from '/imports/ui/components/common';
import {MapFilters, MapSearch} from '/imports/ui/containers/location';
import {
  Map,
  InfoWindow,
  MarkerCluster,
  Marker,
} from 'google-react-maps';

// Elastic Methods
import ESMethods from '/imports/api/elastic/methods';

// Functions
import {Parser} from '/imports/utils'

class Maps extends Component {

  constructor() {
    super();

    // initiate Elastic index parameters
    const
      currentDate = new Date(),
      {
        env,
        elastic: {indices: {geo: {prefix, types: {fieldSales}}}}
      } = Meteor.settings.public,
      {suffix} = Parser().indexSuffix(currentDate, 'day'),
      // index = `${prefix}_${env}-${suffix}`,
      index = `${prefix}_${env}-2017.07.06`,
      type = fieldSales;

    this.state = {
      ready: false,
      filters: {
        country: 'vn',
        timeRange: {
          quick: moment(currentDate).format('LLL'),
          relative: null,
          absolute: null
        }
      },
      search: null,
      index, type,
      mapsData: {},
      mapCenter: {
        lat: 17.981548399599,
        lng: 106.649311603734
      },
      showingInfoWindow: false,
      activeMarker: {},
      selectedPlace: {},
      error: null
    };

    this._getMapsProps = this._getMapsProps.bind(this);

    // maps handlers
    this.onMarkerClick = this.onMarkerClick.bind(this);
  }

  componentDidMount() {
    /* Load initial data from Elastic */
    const {index, type} = this.state;
    ESMethods.search.call({
      index,
      type,
      body: {
        ...bodybuilder()
          .query('match_all', {})
          .build(),
        size: 100
      }
    }, (err, res) => {
      if (err) {
        return this.setState({
          ready: false,
          error: err.reason
        })
      }

      const {ready, hits: mapsData} = res;
      return this.setState({
        ready,
        mapsData
      });
    });
  }

  onMarkerClick({coords, a, b}) {
    const {mapsData: {total, hits}} = this.state;
    const {lng, lat} = coords;
    const info = hits.filter(({_source}) => {
      console.log('lng lat', lng, lat);
      console.log('lnga lata', _source.location[0], _source.location[1]);
      return (lng === _source.location[0] && lat === _source.location[1])
    });
    console.log('info', info, a, b);
  }

  _getMapsProps() {
    const
      {
        mapsData: {total, hits},
        mapCenter,
        selectedPlace,
        activeMarker,
        showingInfoWindow
      } = this.state,
      infoWindow = {
        selectedPlace,
        activeMarker,
        showingInfoWindow
      };
    let markers = [];
    hits.forEach(({_source}) => {
      const {
        gps_id, user_id,
        first_name, last_name,
        email, location,
        store_id, created_at
      } = _source;
      // marker
      markers.push({
        key: gps_id,
        label: store_id.toString(),
        time: moment(created_at).format('LLL'),
        userId: user_id,
        email,
        store: store_id,
        name: `${S(first_name).capitalize().s} ${S(last_name).capitalize().s}`,
        coords: {
          lng: location[0],
          lat: location[1]
        }
      });
    });

    return {
      mapCenter,
      markers,
      infoWindow
    };
  }

  render() {
    const {ready} = this.state;

    if (ready) {
      const
        {filters, search} = this.state,
        mapsActions = {
          onMarkerClick: this.onMarkerClick
        },
        {mapCenter, markers, infoWindow} = this._getMapsProps();

      return (
        <div className="page-content-col">
          <div className="breadcrumbs">
            <h1>Field Sales Locations</h1>
            <MapFilters {...filters}/>
          </div>
          <div className="search-page search-content-2">
            <div className="search-page search-content-2">
              <div className="search-bar bordered">
                <div className="row">
                  <div className="col-md-12">
                    <MapSearch {...search} />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <div className="search-container bordered">
                    <Map
                      onClick={e => console.log(e)}
                      api-key="AIzaSyCWuH5SGDikY4OPSrbJxqTi4Y2uTgQUggw"
                      zoom={5}
                      center={mapCenter}
                      style={{height: 500, width: '100%'}}
                    >
                      {!_.isEmpty(markers) && (
                        <MarkerCluster options={{gridSize: 50, maxZoom: 15}}>
                          {markers.map((marker, idx) => {
                            return (<Marker
                              key={idx}
                              icon="https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png"
                              {...marker}
                              onClick={this.onMarkerClick}
                            >
                            </Marker>);
                          })}
                        </MarkerCluster>
                      )}
                    </Map>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <Spinner/>
        </div>
      );
    }
  }
}

Maps.propTypes = {};

export default Maps
