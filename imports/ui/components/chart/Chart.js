import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ChartJS from 'chart.js';

class Chart extends Component {

  componentDidMount() {
    const
      ctx = this.refs.chart,
      {config} = this.props;

    const chart = this.chart = new ChartJS(ctx, config);
  }

  componentDidUpdate() {
    if (this.chart) {
      this.chart.data.datasets = this.props.config.data.datasets;
      this.chart.update();
    }
  }

  componentWillUnmount() {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }

  render() {
    return (
      <canvas ref="chart"/>
    );
  }
}

Chart.propTypes = {
  config: PropTypes.shape({
    type: PropTypes.string,
    data: PropTypes.shape({
      showLine: PropTypes.bool,
      datasets: PropTypes.arrayOf(PropTypes.object)
    }),
    options: PropTypes.shape({
      responsive: PropTypes.bool,
      title: PropTypes.shape({
        display: PropTypes.bool,
        text: PropTypes.string
      }),
      scales: PropTypes.shape({
        xAxes: PropTypes.arrayOf(PropTypes.object),
        yAxes: PropTypes.arrayOf(PropTypes.object)
      }),
      elements: PropTypes.object
    })
  })
};

export default Chart