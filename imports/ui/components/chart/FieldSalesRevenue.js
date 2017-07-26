import React, {Component} from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import accounting from 'accounting';

// Components
import Chart from './Chart';

// Constants
import {COLORS} from '/imports/ui/components/colors';

class FieldSalesRevenue extends Component {
  render() {

    const {
      label = 'Field Sales Chart',
      xLabel = "Last 24 hours", yLabel = "Revenue",
      timeFormat = 'MM/DD/YYYY HH:mm',
      datasets
    } = this.props;

    function newDateString(days) {
      return moment().add(days, 'd').format(timeFormat);
    }
    const config = {
      type: 'line',
      data: {
        showLine: false,
        datasets
      },
      options: {
        responsive: true,
        title: {
          display: true,
          text: label
        },
        tooltips: {
          mode: 'index',
          callbacks: {
            // Use the footer callback to display the sum of the items showing in the tooltip
            title: function(tooltipItems, data) {
              return `Changed title`;
            },
            label: (tooltipItems, data) => {
              const {xLabel, yLabel} = tooltipItems;
              return `${xLabel} ${yLabel}`;
            }
          },
          footerFontStyle: 'normal'
        },
        scales: {
          xAxes: [{
            type: "time",
            display: true,
            time: {
              format: timeFormat,
              round: 'minute'
            },
            scaleLabel: {
              display: true,
              labelString: xLabel
            },
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: yLabel
            },
            ticks: {
              // Include a dollar sign in the ticks
              callback: function(value, index, values) {
                return `$${accounting.format(value)}`;
              }
            }
          }]
        },
        elements: {
          point: {
            pointStyle: 'circle'
          }
        }
      }
    };

    return (
      <Chart
        config={config}
      />
    );
  }
}

FieldSalesRevenue.propTypes = {};

export default FieldSalesRevenue