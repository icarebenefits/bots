import {Meteor} from 'meteor/meteor';
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {GoogleMaps} from '/imports/ui/components/google/maps';
import bodybuilder from 'bodybuilder';
import moment from 'moment';
import momentTZ from 'moment-timezone';
import S from 'string';
import _ from 'lodash';
import validate from 'validate.js';
import html2canvas from 'html2canvas';
import accounting from 'accounting';
// Components
import {Spinner} from '/imports/ui/components/common';
import {Note, Clock} from '/imports/ui/components';
import {Dialog, Button} from '/imports/ui/components/elements';
import {MapsSearch, MapsNav, StatisticBox} from '/imports/ui/containers/location';
/* Utils */
import {Parser} from '/imports/utils';
// Methods
import ESMethods from '/imports/api/elastic/methods';
import AWSMethods from '/imports/api/aws/methods';
import FBMethods from '/imports/api/facebook-graph/methods';
import {Methods as GEOMethods} from '/imports/api/collections/geo';
// Functions
import * as Notify from '/imports/api/notifications';
// constants
import {COUNTRY_CONST, TIME_RANGE_CONST} from '/imports/ui/containers/location/CONSTANTS';

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
      timeRange: {from: 'now-24h', to: 'now', label: 'Last 24 hours'},

      topFSSize: 3,
      exchangeRates: {},
      mapsData: {},
      purchases: {},
      stats: [],
      totalFieldSales: 0,
      totalPurchases: {},
      topBestFS: [],
      topWorstFS: [],

      activeTab: '',

      center: {lat: 16.002808, lng: 105.488322},
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
    this._getStatsProps = this._getStatsProps.bind(this);
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

  componentDidUpdate() {
    /* Temporary fix for update Statistic box when data changed */
    this._getStatsProps();
  }

  onClickMarker(activeMarkerInfo, activeMarker) {
    this.setState({
      activeMarkerInfo,
      activeMarker,
      activeMarkerId: activeMarkerInfo.userId,
      showInfoWindow: true,
      showPolyline: true,
    });
  }

  getTimeRangeLabel(timeRange) {
    if (_.isEmpty(timeRange)) {
      return 'Today';
    }

    if (timeRange.label) {
      return timeRange.label;
    }

    let label = 'Today';
    switch (timeRange.mode) {
      case 'quick': {
        TIME_RANGE_CONST[timeRange.mode].ranges
          .forEach(r => {
            const range = r.filter(r => (r.from === timeRange.from && r.to === timeRange.to));
            if (!_.isEmpty(range)) {
              label = range[0].label;
            }
          });
        break;
      }
      case 'relative': {
        const {from, to} = Parser().elasticRelativeParts(timeRange.from, timeRange.to);
        label = `${from.count} ${TIME_RANGE_CONST[timeRange.mode].options.filter(r => r.name === from.unit)[0].label}`;
        break;
      }
      case 'absolute': {
        label = `From: ${timeRange.from}, To: ${timeRange.to}`;
        break;
      }
    }

    return label;
  }

  getCountryLabel(country) {
    if (!_.isEmpty(country)) {
      const labels = COUNTRY_CONST.buttons.filter(c => c.name === country);
      if (!_.isEmpty(labels)) {
        return labels[0].label;
      }
    }

    return 'Vietnam';
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
            gmap: {
              center, zoom,
              activeMarkerId,
              showPolyline
            }
          } = geoSLA;

          this.setState({
            name, search, timeRange, country,
            center, zoom, activeMarkerId,
            showPolyline
          }, this._getMapsData);
          return Notify.info({title: 'OPEN GEO SLA', message: `DONE.`});
        });
        break;
      }
      case 'save': {
        const {name} = data,
          center = this.refs.googleMaps.refs.wrapped.refs.map.getCenter(),
          zoom = this.refs.googleMaps.refs.wrapped.refs.map.getZoom();

        this.setState({name, center, zoom});
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
        // Fix problem on Chrome
        // when create the canvas after did some actions on maps (zoom, click, move, ...)
        // which happened because html2canvas can't render some CSS of google maps script
        // https://github.com/niklasvh/html2canvas/issues/345
        if (window.chrome) {// Fix for Chrome
          var transform = $(".gm-style>div:first>div").css("transform");
          var comp = transform.split(","); //split up the transform matrix
          var mapleft = parseFloat(comp[4]); //get left value
          var maptop = parseFloat(comp[5]);  //get top value
          $(".gm-style>div:first>div").css({ //get the map container. not sure if stable
            "transform": "none",
            "left": mapleft,
            "top": maptop,
          });
        }

        html2canvas(ReactDOM.findDOMNode(this.refs.fsLocation), {
          useCORS: true
        })
          .then(canvas => {
            if (canvas) {
              // Rollback CSS to google maps after canvas created
              if (window.chrome) {// Fix for Chrome
                $(".gm-style>div:first>div").css({
                  left: 0,
                  top: 0,
                  "transform": transform
                });
              }

              const
                {suffix} = Parser().indexSuffix(new Date(), 'milisecond'),
                {region, bucket, album} = Meteor.settings.public.aws.s3,
                file = {
                  name: `fs_location-${suffix}.png`
                };
              const dataURI = canvas.toDataURL(file.type);
              file.body = dataURI;
              AWSMethods.addPhoto.call({album, file}, err => {
                if (err) {
                  Notify.error({
                    title: 'GENERATE_FS_LOCATION_IMAGE',
                    message: err.reason
                  });
                }
                // gonna post to workplace
                const {message, workplace = "405969529772344"} = data;
                const imageUrl = `https://${region}.amazonaws.com/${bucket}/${album}/${file.name}`;
                Notify.info({
                  title: 'FS LOCATION',
                  message: 'POSTING TO WORKPLACE.'
                });

                FBMethods.addPhoto.call({groupId: workplace, message, imageUrl}, err => {
                  if (err) {
                    return Notify.error({
                      title: 'FS LOCATION',
                      message: err.reason
                    });
                  }

                  // Delete the posted photo
                  AWSMethods.deletePhoto.call({album, fileName: file.name}, err => {
                    if (err) {
                      Notify.error({
                        title: 'DELETE_TMP_GMAP_PHOTO',
                        message: err.reason
                      });
                    }
                  });

                  return Notify.info({
                    title: 'FS_LOCATION',
                    message: 'POSTED TO WORKPLACE'
                  });
                });
              });
            }
          })
          .catch(err => {
            console.log('html2canvas', err);
          });
        break;
      }
      default:
        Notify.warning({
          title: 'APPLY CONDITION',
          message: `Action: ${action} is unsupported!`
        });
    }
  }

  _saveGeo(action, _id) {
    const {
      name, search, timeRange, country,
      center, zoom,
      activeMarkerId,
      showPolyline
    } = this.state;

    Notify.info({title: 'SAVE GEO SLA', message: 'SAVING.'});
    GEOMethods[action].call({
        _id, name,
        condition: {search, timeRange, country},
        gmap: {
          center, zoom,
          activeMarkerId: activeMarkerId ? activeMarkerId.toString() : '',
          showPolyline
        }
      },
      (err) => {
        if (err)
          return Notify.error({
            title: 'SAVE GEO SLA',
            message: `FAILED: ${err.reason}!`
          });

        this.setState({dialog: {}});
        return Notify.info({title: 'SAVE GEO SLA', message: `DONE.`});
      });
  }

  _buildESBodyWithSearchText(body, search, idField, emailField) {
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
          body.query('term', emailField, search);
        }
      } else {
        // search value is number --> suppose to search by userId
        const userId = Number(search);
        body.filter('term', idField, userId);
      }
    } else {
      body.query('match_all', {});
    }

    return body;
  }

  _buildESBody(searchCondition) {
    const {search, country, timeRange} = searchCondition,
      {maxSize} = Meteor.settings.public.elastic;
    let body = bodybuilder();

    body.sort('@timestamp', 'asc');
    // body.sort('created_at', 'asc');
    body.size(maxSize);

    body.rawOption('_source', [
      'gps_id', 'user_id', 'first_name', 'last_name',
      'email', 'location', 'store_id', 'created_at', '@timestamp', 'country'
    ]);

    body = this._buildESBodyWithSearchText(body, search, 'user_id', 'email.keyword');

    (!_.isEmpty((country)) && country !== 'all') &&
    body.filter('term', 'country', country);

    !_.isEmpty(timeRange) &&
    body.filter('range', 'created_at', {
      gte: timeRange.from,
      lte: timeRange.to
    });

    // aggregations
    body.aggregation('terms', 'country', {shard_size: 200}, 'terms_country', (a) => {
      return a
        .aggregation('value_count', 'gps_id', 'noOfLocations')
        .aggregation('cardinality', 'user_id', 'noOfFieldSales')
    });
    body.aggregation('terms', 'user_id', {shard_size: 200}, 'terms_user', (a) => {
      return a
        .aggregation('value_count', 'gps_id', 'noOfLocations')
    });
    body.aggregation('cardinality', 'user_id', 'totalFieldSales');

    return body.build();
  }

  _getMapsData() {
    const
      {search, country, topFSSize, timeRange, index, type, activeMarkerId} = this.state,
      body = this._buildESBody({search, country, timeRange, activeMarkerId});
    // console.log('body', JSON.stringify(body));

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

      const {ready, hits: mapsData, aggregations} = res;
      let stats = [], totalFS = 0;
      if (!_.isEmpty(aggregations)) {
        const {terms_country: {buckets}, totalFieldSales} = aggregations;
        if (!_.isEmpty(buckets)) {
          stats = buckets;
        }
        if (!_.isEmpty(totalFieldSales)) {
          totalFS = totalFieldSales.value;
        }
      }

      // Get Purchase Stats
      const
        {
          env,
          elastic: {maxSize, indices: {bots: {prefix, types: {salesOrder}}}},
          countries
        } = Meteor.settings.public,
        type = salesOrder,
        totalPurchases = [];
      let currentCountries = [];
      // get currentCountries
      if (!_.isEmpty(mapsData.hits)) {
        currentCountries = _.uniq(mapsData.hits.map(({_source}) => _source.country));
      }

      if (!_.isEmpty(currentCountries)) {
        // reset states before reFetching data
        this.setState({
          totalPurchases: {},
          purchases: {},
          topBestFS: [],
          topWorstFS: []
        }, () => {
          currentCountries.map(country => {
            const
              index = `${prefix}_${country}_${env}`,
              {exchangeRates} = this.state,
              exchangeRate = exchangeRates[country] || countries[country].exchangeRate;
            let emailList = [];
            if (!_.isEmpty(mapsData.hits)) {
              emailList = _.uniq(mapsData.hits
                .filter(({_source: fsLoc}) => (fsLoc.country === country))
                .map(fsLoc => fsLoc._source.email));

              if (!_.isEmpty(emailList)) {
                // console.log('emailList', emailList.length);
                // build search query
                let body = bodybuilder()
                  .size(maxSize)
                  .sort('purchase_date', 'asc')
                  .rawOption('_source', ['purchased_by', 'so_number', 'grand_total_purchase', 'purchase_date'])
                  .filter('terms', 'purchased_by.keyword', emailList)
                  .notFilter('term', 'so_status.keyword', 'canceled')
                  .aggregation('sum', 'grand_total_purchase', 'totalPurchase')
                  .aggregation('terms', 'purchased_by.keyword', {
                    "size": topFSSize,
                    "shard_size": 300, "order": {"total_purchase": "desc"}
                  }, 'top_best_fs', a => {
                    return a.aggregation('sum', 'grand_total_purchase', 'total_purchase')
                  })
                  .aggregation('terms', 'purchased_by.keyword', {
                    "size": topFSSize,
                    "shard_size": 300, "order": {"total_purchase": "asc"}
                  }, 'top_worst_fs', a => {
                    return a.aggregation('sum', 'grand_total_purchase', 'total_purchase')
                  });

                body = this._buildESBodyWithSearchText(body, search, 'magento_customer_id', 'purchased_by.keyword');

                !_.isEmpty(timeRange) &&
                body.filter('range', 'purchase_date', {
                  gte: timeRange.from,
                  lte: timeRange.to
                });

                body = body.build();
                // console.log('getPurchase body', JSON.stringify(body));

                // get total purchase
                ESMethods.search.call({index, type, body}, (err, res) => {
                  if (err) {
                    Notify.warning({
                      title: 'GET TOTAL PURCHASE',
                      message: `Failed: ${err.reason}`
                    });
                  }

                  if (res.hits.total > 0) {
                    this.setState({
                      purchases: {
                        ...this.state.purchases,
                        [country]: res.hits.hits.map(({_source}) => {
                          const {
                            purchased_by: email,
                            so_number: soNumber,
                            grand_total_purchase,
                            purchase_date: date
                          } = _source;
                          return {
                            email, soNumber,
                            purchase: Math.ceil(grand_total_purchase / exchangeRate),
                            country, date
                          };
                        })
                      }
                    });
                  }
                  if (!_.isEmpty(res.aggregations)) {
                    const {
                      aggregations: {
                        totalPurchase: {value: totalPurchase},
                        top_best_fs: {buckets: topBestFS},
                        top_worst_fs: {buckets: topWorstFS}
                      }
                    } = res;

                    this.setState({
                      totalPurchases: {
                        ...this.state.totalPurchases,
                        [country]: Math.ceil(totalPurchase / exchangeRate)
                      },
                      topBestFS: [
                        ...this.state.topBestFS,
                        ...topBestFS.map(({key: email, total_purchase: {value: totalPurchase}}) => ({
                          email, country, totalPurchase: Math.ceil(totalPurchase / exchangeRate)
                        }))
                      ],
                      topWorstFS: [
                        ...this.state.topWorstFS,
                        ...topWorstFS.map(({key: email, total_purchase: {value: totalPurchase}}) => ({
                          email, country, totalPurchase: Math.ceil(totalPurchase / exchangeRate)
                        }))
                      ]
                    });
                  }
                });
              }
            }
          })
        });
      }

      return this.setState({
        ready,
        mapsData,
        stats,
        totalFieldSales: totalFS,
        totalPurchases,
      });
    });
  }

  _getMapsProps() {
    const {
      ready,
      mapsData: {hits},
      center,
      zoom,
      activeMarkerInfo,
      activeMarker,
      activeMarkerId,
      showInfoWindow,
      showPolyline
    } = this.state;
    let
      markers = [],
      startMarkerGpsId = null,
      endMarkerGpsId = null;

    hits.forEach(({_source}) => {
      const {
        gps_id, user_id,
        first_name, last_name,
        email, location,
        store_id, created_at
      } = _source;
      // get marker info
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

    // get start & end markers
    if (activeMarkerId) {
      const activeMarkers = markers.filter(m => m.userId === Number(activeMarkerId));

      if (!_.isEmpty(activeMarkers)) {
        startMarkerGpsId = activeMarkers[0].key;
        endMarkerGpsId = activeMarkers[activeMarkers.length - 1].key;

        markers = markers.map(m => {
          if (startMarkerGpsId && m.key === startMarkerGpsId) {
            m.icon = undefined;
            m.label = 'S';
          }
          if (endMarkerGpsId && m.key === endMarkerGpsId) {
            m.icon = undefined;
            m.label = 'E';
          }
          return m;
        });
      }
    }

    return {
      ready,
      markers,
      center,
      zoom,
      height: 700,
      activeMarker: {
        info: activeMarkerInfo,
        marker: activeMarker
      },
      activeMarkerId,
      showPolyline,
      showInfoWindow
    };
  }

  _getStatsProps() {
    const {countries} = Meteor.settings.public;
    const {
      ready, timeRange, country,
      totalFieldSales, totalPurchases, purchases,
      topFSSize, topBestFS, topWorstFS,
      mapsData: {total: totalLocations, hits}
    } = this.state;
    let locations = {};

    if (!_.isEmpty(hits)) {
      Object.keys(countries).map(country => {
        locations[country] = hits
          .filter(hit => hit._source.country === country)
          .map(({_source}) => {
            const {gps_id: gpsId, email, country, '@timestamp': date} = _source;
            return {gpsId, email, country, date};
          });
      });
    }

    // Get list top best & worst FS ordered asc by total purchase
    const
      topBestFSEmails = topBestFS
        .sort((a, b) => (a.totalPurchase - b.totalPurchase)),
      topWorstFSEmails = topWorstFS
        .sort((a, b) => (a.totalPurchase - b.totalPurchase));

    return {
      ready, timeRange, country,
      purchases, locations,
      topFSSize, topBestFS: topBestFSEmails, topWorstFS: topWorstFSEmails,
      totalFieldSales: accounting.format(totalFieldSales),
      totalLocations: accounting.format(totalLocations),
      totalPurchases
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
    const
      {ready, mapsData, stats, activeTab, name, search, country, timeRange} = this.state,
      handlers = {
        marker: {
          onClick: this.onClickMarker
        },
        tabs: {
          onApply: this.onApply,
          getTimeRangeLabel: this.getTimeRangeLabel,
          getCountryLabel: this.getCountryLabel
        },
        searchBox: {
          onApply: this.onApply
        },
        statisticBox: {
          getTimeRangeLabel: this.getTimeRangeLabel,
          getCountryLabel: this.getCountryLabel
        }
      },
      userTZ = `GMT ${momentTZ().tz(momentTZ.tz.guess()).format('Z')}`;

    return (
      <div className="page-content-col" ref="location">
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
                    value={search}
                    {...handlers.searchBox}
                  />
                </div>
              </div>
            </div>
            <div ref="fsLocation">
              {/* Note */}
              <div className="row">
                <div className="col-md-12">
                  <Note
                    title={`All time will be in GMT+08:00.`}
                    message={`You are in ${userTZ}. Your current time is: `}
                  >
                    <Button
                      className="green"><Clock />
                    </Button>
                  </Note>
                </div>
              </div>
              {!_.isEmpty(stats) && (
                <StatisticBox
                  {...this._getStatsProps()}
                  {...handlers.statisticBox}
                />
              )}
              <div className="row">
                <div className="col-md-12 col-xs-12">
                  {ready ? (
                    <div className="search-container bordered">
                      {(!_.isEmpty(mapsData) && mapsData.total > 0) ? (
                        <GoogleMaps
                          ref="googleMaps"
                          {...this._getMapsProps()}
                          handlers={handlers.marker}
                        />
                      ) : (
                        <div>No data found</div>
                      )}
                    </div>
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
      </div>
    );
  }
}

Location.propTypes = {};

export default Location