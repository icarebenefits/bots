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
    const
      {countries} = Meteor.settings.public,
      {
        purchases, locations,
        topFSSize, topBestFS, topWorstFS,
      } = this.props,
      timeFormat = 'MM/DD/YYYY HH:mm',
      commonProps = {
        pointRadius: 5,
        pointHoverRadius: 10,
        showLine: false, // no line shown
      };
    let
      biggestPurchase = 0,
      biggestPurchaseCountry = '',
      pointColors = {
        purchase: [
          COLORS['yellow-lemon'],
          COLORS['yellow'],
          COLORS['yellow-gold'],
          COLORS['yellow-casablanca'],
          COLORS['yellow-crusta'],
          COLORS['yellow-saffron']
        ],
        location: [
          COLORS['green'],
          COLORS['green-meadow'],
          COLORS['green-seagreen'],
          COLORS['green-turquoise'],
          COLORS['green-haze'],
          COLORS['green-jungle']
        ]
      },
      totalPurchases = 0, // total purchase
      purchaseDataSets = [], // temporary purchase Data Sets
      locationDataSets = [], // temporary location Data Sets
      summaryDataSets = [], // datasets for summary chart
      topBestDataSets = [], // datasets for top best FS chart
      topWorstDataSets = []; // datasets for top worst FS chart

    // purchaseDataSets: collect data
    if (!_.isEmpty(purchases)) {
      // Summary
      Object.keys(countries).map((country, idx) => {
        let totalPurchase = 0;
        purchaseDataSets = [
          ...purchaseDataSets,
          {
            ...commonProps,
            label: `Revenue: ${countries[country].name}`,
            backgroundColor: pointColors.purchase[idx],
            borderColor: pointColors.purchase[idx],
            pointStyle: 'circle',
            yAxisID: "y-axis-revenue",
            data: !_.isEmpty(purchases[country]) ?
              purchases[country].map(({purchase, date}) => {
                if (purchase > biggestPurchase) {
                  biggestPurchase = purchase;
                  biggestPurchaseCountry = countries[country].name;
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
      summaryDataSets = [
        ...summaryDataSets,
        ...purchaseDataSets
      ];

      // Top Worst FS Revenue
      topWorstFS.map((fs, idx) => {
        if (idx < topFSSize) {
          const {email, country} = fs;
          let totalPurchase = 0;
          topWorstDataSets.push({
            ...commonProps,
            label: `Revenue: ${email}`,
            backgroundColor: pointColors.purchase[idx],
            borderColor: pointColors.purchase[idx],
            pointStyle: 'circle',
            yAxisID: "y-axis-revenue",
            data: !_.isEmpty(purchases[country]) ?
              purchases[country]
                .filter(f => f.email === email)
                .map(({purchase, date}) => {
                  totalPurchase += purchase;
                  return {
                    x: moment(date).format(timeFormat),
                    y: totalPurchase
                  };
                }) :
              []
          });
        }
      });
    }
    // locationDataSets: collect data
    if (!_.isEmpty(locations)) {
      Object.keys(countries).map((country, idx) => {
        let count = 0;
        locationDataSets = [
          ...locationDataSets,
          {
            ...commonProps,
            label: `Location: ${countries[country].name}`,
            backgroundColor: pointColors.location[idx],
            borderColor: pointColors.location[idx],
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
      summaryDataSets = [
        ...summaryDataSets,
        ...locationDataSets
      ];

      // Top Worst FS Location
      topWorstFS.map((fs, idx) => {
        if (idx < topFSSize) {
          const {email, country} = fs;
          let count = 0;
          topWorstDataSets.push({
            ...commonProps,
            label: `Location: ${email}`,
            backgroundColor: pointColors.location[idx],
            borderColor: pointColors.location[idx],
            pointStyle: 'rectRot',
            yAxisID: "y-axis-location",
            data: !_.isEmpty(locations[country]) ?
              locations[country]
                .filter(f => f.email === email)
                .map(({date}) => {
                  return {
                    x: moment(date).format(timeFormat),
                    y: ++count
                  };
                }) :
              []
          });
        }
      });
    }

    return {
      totalPurchases,
      biggestPurchase,
      biggestPurchaseCountry,
      summaryDataSets,
      topBestDataSets,
      topWorstDataSets
    };
  }

  render() {
    const
      {
        ready,
        totalFieldSales = accounting.format(3203),
        totalLocations = accounting.format(2347822)
      } = this.props,
      {
        totalPurchases, biggestPurchase, biggestPurchaseCountry,
        summaryDataSets, topBestDataSets, topWorstDataSets
      } = this._getStatisticState(),
      timeRangeLabel = this.props.getTimeRangeLabel(this.props.timeRange),
      countryLabel = this.props.getCountryLabel(this.props.country),
      chartCommonProps = {
        ready,
        xLabel: timeRangeLabel,
        yLabel: {left: 'Revenue', right: 'Location'},
        xAxesTime: {
          format: 'MM/DD/YYYY HH:mm',
          round: 'minute'
        }
      };
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
              title={`${biggestPurchaseCountry} Has Biggest Purchase`}
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
              subTitle={'total'}
              stat={totalFieldSales}
            />
          </div>
          <div className="col-md-3 col-xs-6">
            <WidgetThumb
              title={'Locations'}
              icon="fa-map-marker"
              iconBg="green-meadow"
              subTitle={'total'}
              stat={totalLocations}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <FieldSalesRevenueLocation
              {...chartCommonProps}
              label={`${countryLabel} Field Sales Summary`}
              datasets={summaryDataSets}
            />
          </div>
        </div>
        {/*<div className="row">*/}
          {/*<div className="col-md-12 col-xs-12">*/}
            {/*<FieldSalesRevenueLocation*/}
              {/*{...chartCommonProps}*/}
              {/*label={`Field Sales Need To Increase Revenue`}*/}
              {/*datasets={topWorstDataSets}*/}
            {/*/>*/}
          {/*</div>*/}
        {/*</div>*/}
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