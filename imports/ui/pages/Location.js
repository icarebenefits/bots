import {Meteor} from 'meteor/meteor';
import React, {Component, PropTypes} from 'react';
import {GoogleMaps} from '/imports/ui/components/google/maps';
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

class Location extends Component {

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
      index = `${prefix}_${env}-2017.07.07`,
      // index = `${prefix}_${env}-${suffix}`,
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
    this.onClickMarker = this.onClickMarker.bind(this);
  }

  componentDidMount() {
    /* Load initial data from Elastic */
    const {index, type} = this.state;
    ESMethods.search.call({
      index,
      type,
      body: {
        ...bodybuilder()
          .query('term', 'user_id', 527)
          .sort('created_at', 'asc')
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

  onClickMarker(selectedPlace, activeMarker, event) {
    this.setState({
      selectedPlace,
      activeMarker,
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
        },
        icon: '/img/google/gmap-location.png'
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
        handlers = {
          marker: {
            onClick: this.onClickMarker
          }
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
                      handlers={handlers}
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

Location.propTypes = {};

export default Location