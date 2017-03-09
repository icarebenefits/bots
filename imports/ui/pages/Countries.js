import {Meteor} from 'meteor/meteor';
import React, {Component, PropTypes} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {FlowRouter} from 'meteor/kadira:flow-router';
import {
  DashboardStat
} from '../components';
import {Countries} from '/imports/api/collections/countries';

class CountriesComponent extends Component {
  render() {
    const
      {
        ready,
        countries = [
          {code: 'vn', name: 'Vietnam', stat: 1298},
          {code: 'kh', name: 'Cambodia', stat: 2834},
          {code: 'la', name: 'Laos', stat: 9852}
        ],
      } = this.props,
      colors = ['blue', 'red', 'green', 'yellow', 'purple', 'dark', 'default']
      ;

    if(ready) {
      return (
        <div className="page-content-col">
          {/* Page Content goes here */}
          <div className="row">
            {countries.map((country, idx) => {
              const {code, name, stat = 0} = country;
              return (
                <div key={code} className="col-lg-4 col-md-4 col-sm-6 col-xs-12 margin-bottom-10"
                     onClick={() => {FlowRouter.go('SLAs', {country: code})}}
                >
                  <DashboardStat
                    title={name}
                    color={colors[idx]}
                    icon="fa-globe"
                    stat={stat}
                    description="active SLAs"
                    label="Setup"
                    moreHref={FlowRouter.path('SLAs', {country: code})}
                  />
                </div>
              );
            })}
          </div>
        </div>
      );
    }
    return (
      <div>Loading...</div>
    );
  }
}

CountriesComponent.propTypes = {
  countries: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      stat: PropTypes.number
    })
  )
};

const CountriesContainer = createContainer(() => {
  const
    sub = Meteor.subscribe('countries'),
    ready = sub.ready(),
    countries = Countries.find().fetch()
    ;

  return {
    ready,
    countries
  };

}, CountriesComponent);

export default CountriesContainer