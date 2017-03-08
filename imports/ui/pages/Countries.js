import React, {Component, PropTypes} from 'react'
import {FlowRouter} from 'meteor/kadira:flow-router';
import {
  DashboardStat
} from '../components';

class Countries extends Component {
  render() {
    const
      {countries = [
        {id: 'vn', name: 'Vietnam', stat: 1298},
        {id: 'kh', name: 'Cambodia', stat: 2834},
        {id: 'la', name: 'Laos', stat: 9852}
      ]} = this.props,
      colors = ['blue', 'red', 'green', 'yellow', 'purple', 'dark', 'default']
      ;

    return (
      <div className="page-content-col">
        {/* Page Content goes here */}
        <div className="row">
          {countries.map((country, idx) => {
            const {id, name, stat} = country;
            return (
              <div key={id} className="col-lg-4 col-md-4 col-sm-6 col-xs-12 margin-bottom-10"
                    onClick={() => {FlowRouter.go('SLAs', {country: id})}}
              >
                <DashboardStat
                  title={name}
                  color={colors[idx]}
                  icon="fa-globe"
                  stat={stat}
                  description="active SLAs"
                  label="Setup"
                  moreHref={FlowRouter.path('SLAs', {country: id})}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

Countries.propTypes = {
  countries: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      stat: PropTypes.number
    })
  )
};

export default Countries