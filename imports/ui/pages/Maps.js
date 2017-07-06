import {Meteor} from 'meteor/meteor';
import React, {Component, PropTypes} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {GoogleMaps} from '/imports/ui/google';
import bodybuilder from 'bodybuilder';
import moment from 'moment';
import S from 'string';

// Components
import {Spinner} from '/imports/ui/components/common';
import {MapFilters, MapSearch} from '/imports/ui/containers/location';

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
      index = `${prefix}_${env}-${suffix}`,
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

  onMarkerClick(props, marker, e) {
    console.log('markerClick', props);
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });
  }

  _getMapsProps() {
    const
      {
        mapsData: {total, hits},
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
        time: moment(created_at).format('LLL'),
        userId: user_id,
        email,
        store: store_id,
        name: `${S(first_name).capitalize().s} ${S(last_name).capitalize().s}`,
        position: {
          lng: location[0],
          lat: location[1]
        }
      });
    });

    return {
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
        mapsProps = this._getMapsProps();

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
                    <GoogleMaps
                      {...mapsProps}
                      {...mapsActions}
                    />
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
