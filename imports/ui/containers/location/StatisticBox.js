import React, {Component, PropsTypes} from 'react';
import accounting from 'accounting';
import _ from 'lodash';

class StatisticBox extends Component {
  render() {
    const {
      totalFieldSales = accounting.format(3203),
      totalLocations = accounting.format(2347822),
      totalRevenue = `$${accounting.format(34023003)}`,
      stats = [
        ['Vietnam', '$345', 124, 45],
        ['Cambodia', '$560', 24, 12],
        ['Laos', '$1,568', 46, 450]
      ]
    } = this.props;
    // console.log('statistic box', this.props)
    return (
      <div className="profile-sidebar" style={{width: '100%'}}>
        <div className="portlet light bordered">
          <div className="row list-separated profile-stat">
            <div className="col-md-6 col-sm-6 col-xs-6">
              <div className="uppercase profile-stat-title">{totalFieldSales}</div>
              <div className="uppercase profile-stat-text text-right">Field Sales</div>
            </div>
            <div className="col-md-6 col-sm-6 col-xs-6">
              <div className="uppercase profile-stat-title">{totalLocations}</div>
              <div className="uppercase profile-stat-text text-right"> Locations</div>
            </div>
          </div>
          <div className="portlet-body">
            {/*<h4 className="profile-desc-title">Total Revenue: {` ${totalRevenue}`}</h4>*/}
            {/*<span className="profile-desc-text"> Lorem ipsum dolor sit amet diam nonummy nibh dolore. </span>*/}

            <div className="table-scrollable table-scrollable-borderless">
              <table className="table table-hover table-light">
                <thead>
                <tr className="uppercase bold">
                  <th> Country</th>
                  {/*<th> Revenue</th>*/}
                  <th> Field Sales</th>
                  <th> Locations</th>
                </tr>
                </thead>
                <tbody>
                {!_.isEmpty(stats) && stats.map((stat, i) => (
                  <tr key={i}>
                    {stat.map((s, i) => (
                      <td key={i}>
                        {i === 1 ? (
                          <span className="theme-font">{s}</span>
                        ) : (
                          <span className="theme-font">{s}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

StatisticBox.propTypes = {};

export default StatisticBox