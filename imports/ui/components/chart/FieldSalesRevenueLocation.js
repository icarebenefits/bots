import React, {Component} from 'react';
import PropTypes from 'prop-types';
import accounting from 'accounting';

// Components
import Chart from './Chart';

class FieldSalesRevenue extends Component {
  render() {

    const {
      label = 'Field Sales Chart',
      xLabel = "Last 24 hours", yLabel = {left: 'Revenue', right: 'Location'},
      xAxesTime = {
        format: 'MM/DD/YYYY HH:mm',
        round: 'minute'
      },
      datasets = []
    } = this.props;

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
            // title: function (tooltipItems, data) {
            //   console.log('title items', tooltipItems);
            //   return `Changed title`;
            // },
            label: ({yLabel}) => accounting.format(yLabel)
          },
          footerFontStyle: 'normal'
        },
        scales: {
          xAxes: [{
            type: "time",
            display: true,
            time: xAxesTime,
            scaleLabel: {
              display: true,
              labelString: xLabel
            },
          }],
          yAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: yLabel.left
              },
              position: "left",
              id: "y-axis-revenue",
              ticks: {
                // Include a dollar sign in the ticks
                callback: function (value, index, values) {
                  return `$${accounting.format(value)}`;
                }
              }
            },
            {
              scaleLabel: {
                display: true,
                labelString: yLabel.right
              },
              position: "right",
              id: "y-axis-location",
              ticks: {
                // Include a dollar sign in the ticks
                callback: function (value, index, values) {
                  return `${accounting.format(value)}`;
                }
              }
            }
          ]
        }
      }
    };

    return (
      <div className="portlet light bordered">
        <div className="portlet-body">
          <Chart
            config={config}
          />
        </div>
      </div>
    );
  }
}

FieldSalesRevenue.propTypes = {
  label: PropTypes.string,
  xLabel: PropTypes.string,
  yLabel: PropTypes.shape({
    left: PropTypes.string,
    right: PropTypes.string
  }),
  xAxesTime: PropTypes.shape({
    format: PropTypes.string,
    round: PropTypes.string
  }),
  datasets: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    pointRadius: PropTypes.number,
    pointHoverRadius: PropTypes.number,
    showLine: PropTypes.bool,
    backgroundColor: PropTypes.string,
    borderColor: PropTypes.string,
    pointStyle: PropTypes.string,
    yAxisID: PropTypes.string,
    data: PropTypes.arrayOf(
      PropTypes.shape({
        x: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        y: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      })
    )
  }))
};

export default FieldSalesRevenue