import React, {PropTypes} from 'react';
import moment from 'moment';

const Filters = (props) => {
  const {country, timeRange} = props;

  const getCountry = (country) => {
    return 'Vietnam';
  };
  const getTimeRange = (timeRange) => {
    const {quick, relative, absolute} = timeRange;
    return quick;
  };

  return (
    <ol className="breadcrumb">
      <li>
        <a href="#">{getCountry(country)}</a>
      </li>
      <li>
        <a href="#">{getTimeRange(timeRange)}</a>
      </li>
    </ol>
  );
};

Filters.propTypes = {
  country: PropTypes.string,
  timeRange: PropTypes.shape({
    quick: PropTypes.string,
    relative: PropTypes.object,
    absolute: PropTypes.shape({
      from: PropTypes.string,
      to: PropTypes.string
    })
  })
};

export default Filters