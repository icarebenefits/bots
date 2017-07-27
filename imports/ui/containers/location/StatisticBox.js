import React, {Component} from 'react';
import PropTypes from 'prop-types';
import accounting from 'accounting';
import _ from 'lodash';
import moment from 'moment';

// Components
import {FieldSalesRevenueLocation} from '/imports/ui/components/chart';
import {WidgetThumb} from '/imports/ui/components';
// Constants
import {COLORS} from '/imports/ui/components/colors';

class StatisticBox extends Component {

  constructor() {
    super();

    this.state = {
      totalPurchases: 0,
      biggestPurchase: 0
    };

    /* Handlers */
    // Private
    this._getStatisticState = this._getStatisticState.bind(this);
  }

  _getStatisticState() {
    const {countries} = Meteor.settings.public;
    const {purchases, locations} = this.props;
    const timeFormat = 'MM/DD/YYYY HH:mm';
    const commonProps = {
      pointRadius: 5,
      pointHoverRadius: 10,
      showLine: false, // no line shown
    };
    let
      biggestPurchase = 0,
      totalPurchases = 0, // total revenue
      purchaseDataSets = [], // revenue Data Sets
      locationDataSets = []; // location Data Sets

    // revenueDataSets: collect data
    if (!_.isEmpty(purchases)) {
      const pointColors = [
        COLORS['yellow-lemon'],
        COLORS['yellow'],
        COLORS['yellow-gold'],
        COLORS['yellow-casablanca'],
        COLORS['yellow-crusta'],
        COLORS['yellow-saffron']
      ];
      Object.keys(countries).map((country, idx) => {
        let totalPurchase = 0;
        purchaseDataSets = [
          ...purchaseDataSets,
          {
            ...commonProps,
            label: `Revenue: ${countries[country].name}`,
            backgroundColor: pointColors[idx],
            borderColor: pointColors[idx],
            pointStyle: 'circle',
            yAxisID: "y-axis-revenue",
            data: !_.isEmpty(purchases[country]) ?
              purchases[country].map(({purchase, date}) => {
                if (purchase > biggestPurchase) {
                  biggestPurchase = purchase;
                }
                totalPurchase += purchase;
                return {
                  x: moment(date).format(timeFormat),
                  y: totalPurchase
                };
              }) :
              []
          }
        ];
        totalPurchases += totalPurchase;
      });
    }
    // locationDataSets: collect data
    if (!_.isEmpty(locations)) {
      const pointColors = [
        COLORS['green'],
        COLORS['green-meadow'],
        COLORS['green-seagreen'],
        COLORS['green-turquoise'],
        COLORS['green-haze'],
        COLORS['green-jungle']
      ];
      Object.keys(countries).map((country, idx) => {
        let count = 0;
        locationDataSets = [
          ...locationDataSets,
          {
            ...commonProps,
            label: `Location: ${countries[country].name}`,
            backgroundColor: pointColors[idx],
            borderColor: pointColors[idx],
            pointStyle: 'rectRot',
            yAxisID: "y-axis-location",
            data: !_.isEmpty(locations[country]) ?
              locations[country].map(({date}) => {
                return {
                  x: moment(date).format(timeFormat),
                  y: ++count
                };
              }) :
              []
          }
        ];
      });
    }

    return {
      totalPurchases,
      biggestPurchase,
      dataSets: [
        ...purchaseDataSets,
        ...locationDataSets
      ]
    };
  }

  render() {
    const
      {
        totalFieldSales = accounting.format(3203),
        totalLocations = accounting.format(2347822)
      } = this.props,
      {totalPurchases, biggestPurchase, dataSets} = this._getStatisticState();
    // console.log('dataSets', this._getDataSet());

    return (
      <div>
        <div className="row">
          <div className="col-md-3 col-xs-6">
            <WidgetThumb
              title={'Total Purchase'}
              icon="fa-dollar"
              iconBg="blue"
              subTitle={'USD'}
              stat={accounting.format(totalPurchases)}
            />
          </div>
          <div className="col-md-3 col-xs-6">
            <WidgetThumb
              title={'Biggest Purchase'}
              icon="fa-diamond"
              iconBg="yellow-saffron"
              subTitle={'USD'}
              stat={accounting.format(biggestPurchase)}
            />
          </div>
          <div className="col-md-3 col-xs-6">
            <WidgetThumb
              title={'Field Sales'}
              icon="fa-user-secret"
              iconBg="purple"
              subTitle={''}
              stat={totalFieldSales}
            />
          </div>
          <div className="col-md-3 col-xs-6">
            <WidgetThumb
              title={'Locations'}
              icon="fa-map-marker"
              iconBg="green-meadow"
              subTitle={''}
              stat={totalLocations}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <FieldSalesRevenueLocation
              datasets={dataSets}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 col-xs-12">
            <FieldSalesRevenueLocation
              datasets={[]}
            />
          </div>
          <div className="col-md-6 col-xs-12">
            <FieldSalesRevenueLocation
              datasets={[]}
            />
          </div>
        </div>
      </div>
    );
  }
}

StatisticBox.propTypes = {
  totalFieldSales: PropTypes.string,
  totalLocations: PropTypes.string,
  stats: PropTypes.arrayOf(
    PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    )
  )
};

export default StatisticBox