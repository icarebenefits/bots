import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import accounting from 'accounting';

import {Button} from './elements';

const DashboardStat = (props) => {
  const
    {
      title = '', color = 'green', icon = 'fa-group', stat = '',
      description = '', label = 'View more', moreHref = '#'
    } = props,
    style = {
      details: {
        marginRight: 20
      }
    }
    ;

  return (
    <div className="portlet light bordered">
      <div className="portlet-title">
        <div className="caption">
          <i className="icon-share font-blue"></i>
          <span className="caption-subject font-green-haze bold uppercase">{title}</span>
        </div>
      </div>
      <div className="portlet-body">
        <div className={classNames('dashboard-stat', color)}>
          <div className="visual">
            <i className={classNames('fa', icon, 'fa-icon-medium')}></i>
          </div>
          <div className="details" style={style.details}>
            <div className="number">
              {Number.isNaN(Number(stat)) ? stat : accounting.format(stat)}
            </div>
            <div className="desc"> {description} </div>
          </div>
          <Button className="more" href={moreHref}>
            <i className="m-icon-swapright fa-icon-white"></i>
            {' '}{label}
          </Button>
        </div>
      </div>
    </div>
  );
};

DashboardStat.propTypes = {
  title: PropTypes.string,
  color: PropTypes.string,
  icon: PropTypes.string,
  stat: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  description: PropTypes.string,
  label: PropTypes.string,
  moreHref: PropTypes.string,
};

export default DashboardStat

