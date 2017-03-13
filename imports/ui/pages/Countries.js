import {Meteor} from 'meteor/meteor';
import React, {Component, PropTypes} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {FlowRouter} from 'meteor/kadira:flow-router';
// components
import {
  DashboardStat
} from '../components';
// collections
import {Countries} from '/imports/api/collections/countries';
import SLAsCollection from '/imports/api/collections/slas/slas';

class CountriesComponent extends Component {
  render() {
    const
      {
        ready,
        countries,
        SLAs
      } = this.props,
      colors = ['blue', 'red', 'green', 'yellow', 'purple', 'dark', 'default']
      ;

    const statCountries = countries.map(country => {
      const {code, name} = country
      const stat = SLAs.filter(sla => sla.country === country.code).length;
      return {
        code,
        name,
        stat,
      }
    });

    if(ready) {
      return (
        <div className="page-content-col">
          {/* Page Content goes here */}
          <div className="row">
            {statCountries.map((country, idx) => {
              const {code, name, stat} = country;
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
    subSLA = Meteor.subscribe('slasList'),
    ready = sub.ready() && subSLA.ready(),
    countries = Countries.find().fetch(),
    SLAs = SLAsCollection.find({status: 1}).fetch()
    ;

  return {
    ready,
    countries,
    SLAs
  };

}, CountriesComponent);

export default CountriesContainer