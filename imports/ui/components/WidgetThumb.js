import React from 'react';
import PropTypes from 'prop-types';

const WidgetThumb = (props) => {
  const {title = '', icon = '', iconBg = 'green', subTitle = '', stat = ''} = props;
  return (
    <div className="widget-thumb widget-bg-color-white text-uppercase margin-bottom-20 bordered">
      <h4 className="widget-thumb-heading">{title}</h4>
      <div className="widget-thumb-wrap">
        <i className={`widget-thumb-icon bg-${iconBg} fa ${icon}`}/>
        <div className="widget-thumb-body">
          <span className="widget-thumb-subtitle">{subTitle}</span>
          <span className="widget-thumb-body-stat">{stat}</span>
        </div>
      </div>
    </div>
  );
};

WidgetThumb.propTypes = {
  title: PropTypes.string,
  icon: PropTypes.string,
  subTitle: PropTypes.string,
  stat: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};

export default WidgetThumb