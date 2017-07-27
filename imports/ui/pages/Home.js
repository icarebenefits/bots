import {Meteor} from 'meteor/meteor';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {createContainer} from 'meteor/react-meteor-data';
import {FlowRouter} from 'meteor/kadira:flow-router';
import {Session} from 'meteor/session';
import bodybuilder from 'bodybuilder';
// components
import {DashboardStat} from '../components';
import {Spinner} from '/imports/ui/components/common';
// collections
import {Countries} from '/imports/api/collections/countries';
import SLAsCollection from '/imports/api/collections/slas/slas';
// Methods
import ESMethods from '/imports/api/elastic/methods';
// Functions
import * as Notify from '/imports/api/notifications';

class Home extends Component {
  constructor() {
    super();

    this.state = {
      totalFieldSales: 0
    };
  }

  componentDidMount() {
    const
      {
        env,
        elastic: {indices: {geo: {prefix, types: {fieldSales}}}}
      } = Meteor.settings.public,
      index = `${prefix}_${env}`,
      type = fieldSales;
    ESMethods.search.call({
      index,
      type,
      body: bodybuilder()
        .aggregation('cardinality', 'user_id', 'distinct_users')
        .build()
    }, (err, res) => {
      if (err) {
        return Notify.warning({
          title: 'GET_TOTAL_FIELD_SALES',
          message: `Failed: ${err.reason}`
        })
      }
      const {aggregations: {distinct_users: {value: totalFieldSales}}} = res;
      if (totalFieldSales) {
        this.setState({totalFieldSales});
      }
    });
  }

  render() {
    const
      {
        ready,
        countries,
        SLAs,
        showAdminBox,
        activeUsers,
      } = this.props,
      {totalFieldSales} = this.state,
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

    if (ready) {
      return (
        <div className="page-content-col">
          {/* Page Content goes here */}
          <div className="row">
            {statCountries.map((country, idx) => {
              const {code, name, stat} = country;
              return (
                <div key={code} className="col-lg-4 col-md-4 col-sm-6 col-xs-12 margin-bottom-10"
                     onClick={() => {
                       FlowRouter.go('setup', {page: 'setup', country: code})
                     }}
                >
                  <DashboardStat
                    title={name}
                    color={colors[idx]}
                    icon="fa-globe"
                    stat={stat}
                    description="active SLAs"
                    label="Setup"
                    moreHref={FlowRouter.path('setup', {page: 'setup', country: code})}
                  />
                </div>
              );
            })}
          </div>
          <div className="row">
            <div key='location' className="col-lg-4 col-md-4 col-sm-6 col-xs-12 margin-bottom-10"
                 onClick={() => {
                   FlowRouter.go('maps')
                 }}
            >
              <DashboardStat
                title={"Field Sales Location"}
                color="green-meadow"
                icon="fa-map-marker"
                stat={totalFieldSales}
                description="field Sales"
                label="Maps"
                moreHref={FlowRouter.path('maps')}
              />
            </div>
            {(showAdminBox) && (
              <div key='admin' className="col-lg-4 col-md-4 col-sm-6 col-xs-12 margin-bottom-10"
                   onClick={() => {
                     FlowRouter.go('access-list')
                   }}
              >
                <DashboardStat
                  title={"Administration"}
                  color="dark"
                  icon="fa-cog"
                  stat={activeUsers}
                  description="active Users"
                  label="Setup"
                  moreHref={FlowRouter.path('access-list')}
                />
              </div>
            )}
          </div>
        </div>
      );
    }
    return (
      <div>
        <Spinner/>
      </div>
    );
  }
}

Home.propTypes = {
  countries: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      stat: PropTypes.number
    })
  )
};

const HomeContainer = createContainer(() => {
  const
    sub = Meteor.subscribe('countries'),
    subSLA = Meteor.subscribe('slasList'),
    subUsers = Meteor.subscribe('activeUsers'),
    loggedIn = Session.get('loggedIn'),
    isSuperAdmin = Session.get('isSuperAdmin'),
    ready = sub.ready() && subSLA.ready() && subUsers.ready(),
    countries = Countries.find().fetch(),
    SLAs = SLAsCollection.find({status: {$nin: ['inactive', 'draft']}}).fetch(),
    showAdminBox = loggedIn && isSuperAdmin;
  let activeUsers = 0;

  if (showAdminBox) {
    activeUsers = Meteor.users.find().count();
  }

  return {
    ready,
    countries,
    SLAs,
    showAdminBox,
    activeUsers,
  };

}, Home);

export default HomeContainer