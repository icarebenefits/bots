import {Meteor} from 'meteor/meteor';
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {GoogleMaps} from '/imports/ui/components/google/maps';
import bodybuilder from 'bodybuilder';
import moment from 'moment';
import S from 'string';
import _ from 'lodash';
import validate from 'validate.js';
import html2canvas from 'html2canvas';
import {dataURIToBlob} from '/imports/utils';

// Collections
import {ImagesStore} from '/imports/api/collections/fileStore';

// Components
import {Spinner} from '/imports/ui/components/common';
import {Dialog} from '/imports/ui/components/elements';
import {MapsSearch, MapsNav} from '/imports/ui/containers/location';

// Methods
import ESMethods from '/imports/api/elastic/methods';
import {Methods as GEOMethods} from '/imports/api/collections/geo';
import {Methods as ImagesMethods} from '/imports/api/collections/fileStore';

// Functions
import * as Notify from '/imports/api/notifications';

class Location extends Component {

  constructor() {
    super();

    // initiate Elastic index parameters
    const
      {
        env,
        elastic: {indices: {geo: {prefix, types: {fieldSales}}}}
      } = Meteor.settings.public,
      index = `${prefix}_${env}`,
      type = fieldSales;

    this.state = {
      ready: false,
      index, type,
      name: '',
      search: null,
      country: 'vn',
      timeRange: {from: 'now/d', to: 'now/d', label: 'Today', mode: 'quick'},
      mapsData: {},
      activeTab: '',
      center: {},
      zoom: null,
      activeMarker: {},
      activeMarkerInfo: {},
      activeMarkerId: null,
      showInfoWindow: false,
      showPolyline: false,
      dialog: {}
    };

    /* Handlers */
    // private
    this._getMapsData = this._getMapsData.bind(this);
    this._getMapsProps = this._getMapsProps.bind(this);
    this._closeDialog = this._closeDialog.bind(this);

    // public
    this.onClickMarker = this.onClickMarker.bind(this);
    this.onApply = this.onApply.bind(this);
  }

  componentDidMount() {
    /* Load initial data from Elastic */
    this._getMapsData();
  }

  _getMapsData() {
    const {search, country, timeRange, index, type} = this.state;
    // console.log('searchCondition', {search, country, timeRange, index, type});
    const body = this._buildESBody({search, country, timeRange});
    console.log('body', JSON.stringify(body));

    this.setState({ready: false});
    ESMethods.search.call({
      index,
      type,
      body
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

  _buildESBody(searchCondition) {
    const {search, country, timeRange} = searchCondition;
    let body = bodybuilder();

    body.sort('created_at', 'asc');
    body.size(10000);

    if (!_.isEmpty(search)) {
      if (isNaN(search)) {
        // search value is not a number --> suppose to search by name or email
        const constraint = {
          search: {
            email: true
          }
        };
        const validation = validate.validate({search}, constraint);
        if (!_.isEmpty(validation)) {
          // warning user if they want to search by email but enter wrong email format
          // if (S(search).contains('@')) {
          Notify.warning({
            title: 'Validate search text',
            message: validation.search[0]
          });
          // }
          // search value is not an email --> suppose to search by name
          // body.query('multi_match', 'query', search,
          //   {"fields": ["first_name", "last_name"], "type": "cross_fields"}
          // );
        } else {
          // search value is an email --> search by email
          body.query('term', 'email.keyword', search);
        }
      } else {
        // search value is number --> suppose to search by userId
        const userId = Number(search);
        body.filter('term', 'user_id', userId);
      }
    } else {
      body.query('match_all', {});
    }


    (!_.isEmpty((country)) && country !== 'all') &&
    body.filter('term', 'country', country);

    !_.isEmpty(timeRange) &&
    body.filter('range', 'created_at', {
      gte: timeRange.from,
      lte: timeRange.to
    });

    return body.build();
  }

  _saveGeo(action, _id) {
    const {
      name, search, timeRange, country,
      activeMarkerId,
      showPolyline, showInfoWindow
    } = this.state,
    center = this.refs.gmap.getCenter(),
    zoom = this.refs.gmap.getZoom();
    Notify.info({title: 'SAVE GEO SLA', message: 'SAVING.'});
    console.log('save GEO SLA', {
      _id, name,
      condition: {search, timeRange, country},
      gmap: {center, zoom,
        activeMarkerId,
        showInfoWindow, showPolyline
      }
    });
    GEOMethods[action].call({
        _id, name,
        condition: {search, timeRange, country},
        gmap: {center, zoom,
          activeMarkerId,
          showInfoWindow, showPolyline
        }
      },
      (err, res) => {
        if (err)
          return Notify.error({
            title: 'SAVE GEO SLA',
            message: `FAILED: ${err.reason}!`
          });

        this.setState({dialog: {}});
        return Notify.info({title: 'SAVE GEO SLA', message: `DONE.`});
      });
  }

  onClickMarker(activeMarkerInfo, activeMarker, event) {
    this.setState({
      activeMarkerInfo,
      activeMarker,
      activeMarkerId: activeMarkerInfo.userId,
      showInfoWindow: true,
      showPolyline: true,
    });
  }

  onApply(action, data) {
    switch (action) {
      case 'search': {
        const {search} = data;
        this.setState({search}, this._getMapsData);
        break;
      }
      case 'timeRange': {
        const {timeRange} = data;
        this.setState({timeRange}, this._getMapsData);
        break;
      }
      case 'country': {
        const {country} = data;
        this.setState({country}, this._getMapsData);
        break;
      }
      case 'refresh': {
        this._getMapsData();
        break;
      }
      case 'open': {
        const {name} = data;

        Notify.info({title: 'OPEN GEO SLA', message: `OPENING.`});
        GEOMethods.getByName.call({name}, (err, geoSLA) => {
          if (err)
            return Notify.error({title: 'OPEN GEO SLA', message: `FAILED: ${err.reason}!`});

          const {
            name,
            condition: {search, timeRange, country},
            gmap: {center, zoom,
              activeMarkerId,
              showInfoWindow, showPolyline
            }
          } = geoSLA;
          console.log('gonna set state', {
            name,
            condition: {search, timeRange, country},
            gmap: {center, zoom,
              activeMarkerId,
              showInfoWindow, showPolyline
            }
          });
          this.setState({
            name, search, timeRange, country,
            center, zoom, activeMarkerId,
            showPolyline, showInfoWindow
          }, this._getMapsData);
          return Notify.info({title: 'OPEN GEO SLA', message: `DONE.`});
        });
        break;
      }
      case 'save': {
        const {name} = data;

        this.setState({name});
        // validate geo Name before save
        GEOMethods.validateGeoName.call({name, type: 'field_sales'}, (err, res) => {
          if (err) {
            return Notify.error({
              title: 'VALIDATE GEO SLA NAME',
              message: `FAILED: ${err.reason}!`
            });
          }
          const {isExists, _id} = res;
          if (isExists) {
            this.setState({
              dialog: {_id}
            });
          } else {
            this._saveGeo('create');
          }
        });

        break;
      }
      case 'post': {
        html2canvas(ReactDOM.findDOMNode(this.refs.gmap), {
          useCORS: true
        })
          .then(canvas => {
            // console.log('canvas', canvas.toDataURL());
            if (canvas) {
              const dataURI = canvas.toDataURL("image/png");
              // console.log('dataURI', dataURI);
              const imageBlob = dataURIToBlob(dataURI);
              var blobUrl = URL.createObjectURL(myBlob);
              console.log('blobUrl', blobUrl);

            }
          })
          .catch(err => {
            console.log('html2canvas', err);
          });
        break;
      }
      default:
        Notify.warning({
          title: 'Apply condition',
          message: `Action: ${action} is unsupported!`
        });
    }
  }

  _getMapsProps() {
    const
      {
        mapsData: {total, hits},
        center,
        zoom,
        activeMarkerInfo,
        activeMarker,
        activeMarkerId,
        showInfoWindow,
        showPolyline
      } = this.state;
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
      center,
      zoom,
      activeMarker: {
        info: activeMarkerInfo,
        marker: activeMarker
      },
      activeMarkerId,
      showPolyline,
      showInfoWindow
    };
  }

  _renderDialog() {
    const {dialog} = this.state;

    if (_.isEmpty(dialog)) {
      return null;
    }

    return (
      <Dialog
        modal={true}
        className="DialogMedium"
        bodyClass="text-left"
        header="Save GEO SLA"
        confirmLabel="Ok"
        hasCancel={true}
        onAction={this._closeDialog}
      >
        <div>{`Are you sure want to overwrite "${this.state.name}?"`}</div>
      </Dialog>
    );
  }

  _closeDialog(action) {
    if (action === 'dismiss') {
      this.setState({dialog: {}});
    } else {
      this._saveGeo('update', this.state.dialog._id);
    }
  }

  render() {
    const {ready} = this.state;

    const
      {mapsData, activeTab, name, search, country, timeRange} = this.state,
      handlers = {
        marker: {
          onClick: this.onClickMarker
        },
        tabs: {
          onApply: this.onApply
        },
        searchBox: {
          onApply: this.onApply
        }
      };

    console.log('Location props', this.props);

    return (
      <div className="page-content-col">
        <MapsNav
          title={`Field Sales Location ${name ? `- ${name}` : ''}`}
          activeTab={activeTab}
          name={name}
          country={country}
          timeRange={timeRange}
          {...handlers.tabs}
        />
        <div className="search-page search-content-2">
          <div className="search-page search-content-2">
            <div className="search-bar bordered">
              <div className="row">
                <div className="col-md-12">
                  <MapsSearch
                    {...search}
                    {...handlers.searchBox}
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <div className="search-container bordered">
                  {ready ? (
                    (!_.isEmpty(mapsData) && mapsData.total > 0) ? (
                      <GoogleMaps
                        ref="gmap"
                        {...this._getMapsProps()}
                        handlers={handlers.marker}
                      />
                    ) : (
                      <div>No data found</div>
                    )
                  ) : (
                    <div>
                      <Spinner/>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        {this._renderDialog()}
        <div ref="imgOut"></div>
      </div>
    );
  }
}

Location.propTypes = {};

export default Location