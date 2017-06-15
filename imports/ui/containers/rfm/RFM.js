import {Meteor} from 'meteor/meteor';
import React, {Component, PropTypes} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {FlowRouter} from 'meteor/kadira:flow-router';
import _ from 'lodash';
import accounting from 'accounting';

/* Collections */
import {RFMScoreBoard, RFMTopTen} from '/imports/api/collections/rfm';
/* Utils */
import {conciseNumber} from '/imports/utils';

class RFM extends Component {

  constructor() {
    super();

    this.state = {
      filter: 'champions'
    };

    this._renderTopTen = this._renderTopTen.bind(this);
  }

  _onChangeFilter(filter) {
    this.setState({filter});
  }

  _renderTopTen() {
    const
      {filter} = this.state,
      {TopTen: [topten], currency} = this.props;
    if(!_.isEmpty(topten[filter])) {
      return topten[filter].map((iCM, index) => {
        const {name, company, monetary} = iCM;
        return (
          <div key={index} className="mt-comment">
            <div className="mt-comment-img">{index + 1}</div>
            <div className="mt-comment-body">
              <div className="mt-comment-info">
                <span className="mt-comment-author">{name}</span>
                <span className="mt-comment-date">{`${accounting.format(monetary)} ${currency}`}</span>
              </div>
              <div className="mt-comment-text">
                {company}
              </div>
            </div>
          </div>
        );
      });
    } else {
      return (
        <div className="mt-comment">
          <div className="mt-comment-body">
            <div className="mt-comment-text">
              No data for this segment
            </div>
          </div>
        </div>
      );
    }
  }

  render() {
    const {ready} = this.props;
    if(ready) {
      const
        {filter} = this.state,
        {country, currency, ScoreBoard: [scoreboard]} = this.props,
        {
          total, purchased,
          champion, loyal, potential, new: newCustomer,
          promissing, attention, sleep, risk,
          losing, hibernating, lost,
          theBestChampion, theBestLoyal, theBestPotential
        } = scoreboard,
        filters = [
          {name: 'champions', label: 'Champions'},
          {name: 'loyals', label: 'Loyal Customers'},
          {name: 'potentials', label: 'Potential Loyalist'},
          {name: 'news', label: 'New Customers'},
          {name: 'promissings', label: 'Promising'},
          {name: 'attentions', label: 'Needing Attention'},
          {name: 'sleeps', label: 'About To Sleep'},
          {name: 'risks', label: 'At Risk'},
          {name: 'losings', label: "Can’t Lose Them"},
          {name: 'hibernatings', label: 'Hibernating'},
          {name: 'losts', label: 'Lost'}
        ],
        filterLabel = filters
          .filter(f => f.name === filter)[0].label,
        images = {
          champion: {
            vn: "/img/rfm/angry-bird-icon.png",
            kh: "/img/rfm/angry-bird-yellow-icon.png",
            la: "/img/rfm/angry-bird-blue-icon.png"
          },
          loyal: {
            vn: "/img/rfm/angry-bird-green-icon.png",
            kh: "/img/rfm/angry-bird-blue-icon.png",
            la: "/img/rfm/angry-bird-yellow-icon.png"
          },
          potential: {
            vn: "/img/rfm/angry-bird-black-icon.png",
            kh: "/img/rfm/angry-bird-white-icon.png",
            la: "/img/rfm/Angry-Birds-Star-Wars-2-icon.png"
          }
        };
      return (
        <div className="page-content-row">
          <div className="page-content-col">
            <div className="note note-info">
              <h2>
                <span className="label label-primary uppercase">
                  {`Data was last updated on: June 15, 2017`}
                </span>
              </h2>
            </div>
            <div className="row">
              <div className="col-md-4">
                <div className="row">
                  <div className="col-md-8">
                    <div className="widget-thumb widget-bg-color-white text-uppercase margin-bottom-20 bordered">
                      <h4 className="widget-thumb-heading">Total</h4>
                      <div className="widget-thumb-wrap">
                        <i className="widget-thumb-icon bg-green icon-bulb"></i>
                        <div className="widget-thumb-body">
                          <span className="widget-thumb-subtitle">iCare members</span>
                      <span className="widget-thumb-body-stat" data-counter="counterup"
                            data-value="7,644">{accounting.format(total)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-8">
                    <div className="widget-thumb widget-bg-color-white text-uppercase margin-bottom-20 bordered">
                      <h4 className="widget-thumb-heading">Has purchased</h4>
                      <div className="widget-thumb-wrap">
                        <i className="widget-thumb-icon bg-green icon-bulb"></i>
                        <div className="widget-thumb-body">
                          <span className="widget-thumb-subtitle">iCare members</span>
                          <span className="widget-thumb-body-stat" data-counter="counterup">
                            {accounting.format(purchased)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-8">
                <div className="portlet light bordered">
                  <div className="portlet-title tabbable-line">
                    <div className="caption">
                      <i className="icon-bubbles font-dark hide"></i>
                      <span className="caption-subject font-dark bold uppercase">Scorboard of purchased iCare members</span>
                    </div>
                  </div>
                  <div className="portlet-body">
                    <div className="btn-group btn-group btn-group-justified">
                      <a id="1-1" href="" className="btn btn-danger btn-lg btn-graphic" disabled>
                        {`Can't lose them (${accounting.format(losing)})`}</a>
                      <a id="1-2" href="" className="btn yellow btn-lg btn-graphic" disabled>
                        {`At risk (${accounting.format(risk)})`}</a>
                      <a id="1-3" href="" className="btn green-haze btn-lg btn-graphic" disabled></a>
                      <a id="1-4" href="" className="btn green-haze btn-lg btn-graphic"
                         disabled>{`Loyal customers (${accounting.format(loyal)})`}</a>
                      <a id="1-5" href="" className="btn btn-success btn-lg btn-graphic" disabled>
                        {`Champions (${accounting.format(champion)})`}</a>
                    </div>
                    <div className="btn-group btn-group btn-group-justified">
                      <a id="2-1" href="" className="btn yellow btn-lg btn-graphic" disabled></a>
                      <a id="2-2" href="" className="btn yellow btn-lg btn-graphic" disabled></a>
                      <a id="2-3" href="" className="btn green-haze btn-lg btn-graphic" disabled></a>
                      <a id="2-4" href="" className="btn green-haze btn-lg btn-graphic" disabled></a>
                      <a id="2-5" href="" className="btn green-haze btn-lg btn-graphic" disabled></a>
                    </div>
                    <div className="btn-group btn-group btn-group-justified">
                      <a id="3-1" href="" className="btn yellow btn-lg btn-graphic" disabled></a>
                      <a id="3-2" href="" className="btn yellow btn-lg btn-graphic" disabled></a>
                      <a id="3-3" href="" className="btn blue btn-lg btn-graphic" disabled>
                        {`Need attention (${accounting.format(attention)})`}</a>
                      <a id="3-4" href="" className="btn green btn-lg btn-graphic" disabled></a>
                      <a id="3-5" href="" className="btn green btn-lg btn-graphic"
                         disabled>{`Potential loyalist (${accounting.format(potential)})`}</a>
                    </div>
                    <div className="btn-group btn-group btn-group-justified">
                      <a id="4-1" href="" className="btn grey-cascade btn-lg btn-graphic" disabled></a>
                      <a id="4-2" href="" className="btn btn-default btn-lg btn-graphic" disabled>
                        {`hibernating (${accounting.format(hibernating)})`}</a>
                      <a id="4-3" href="" className="btn blue-hoki btn-lg btn-graphic" disabled>
                        {`About to sleep (${accounting.format(sleep)})`}</a>
                      <a id="4-4" href="" className="btn green btn-lg btn-graphic" disabled></a>
                      <a id="4-5" href="" className="btn green btn-lg btn-graphic" disabled></a>
                    </div>
                    <div className="btn-group btn-group btn-group-justified">
                      <a id="5-1" href="" className="btn grey-cascade btn-lg btn-graphic" disabled></a>
                      <a id="5-2" href="" className="btn grey-cascade btn-lg btn-graphic" disabled>
                        {`Lost (${accounting.format(lost)})`}</a>
                      <a id="5-3" href="" className="btn blue-hoki btn-lg btn-graphic" disabled></a>
                      <a id="5-4" href="" className="btn purple-sharp btn-lg btn-graphic" disabled>
                        {`Promissing (${accounting.format(promissing)})`}</a>
                      <a id="5-5" href="" className="btn btn-default btn-lg btn-graphic" disabled>
                        {`New customers (${accounting.format(newCustomer)})`}</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-8">
                <div className="portlet light bordered">
                  <div className="portlet-title">
                    <div className="caption">
                      <i className="fa fa-bubble font-dark hide"></i>
                      <span className="caption-subject font-hide bold uppercase">Top iCare members</span>
                    </div>
                  </div>
                  <div className="portlet-body">
                    <div className="row">
                      <div className="col-md-4">
                        <div className="mt-widget-1">
                          <div className="mt-fa fa">
                            <h4 className="item-name primary-link">
                              The Best Champion
                            </h4>
                          </div>
                          <div className="mt-img">
                            <img className="img-responsive img-widget" src={images.champion[country]}/></div>
                          <div className="mt-body">
                            <h3 className="mt-username">{theBestChampion.name}</h3>
                            <p className="mt-user-title">{theBestChampion.company}</p>
                            <div className="mt-stats">
                              <div className="btn-group btn-group btn-group-justified">
                                <a href="" className="btn font-green">Recency</a>
                                <a href="" className="btn font-red">Frequency</a>
                                <a href="" className="btn font-yellow">Monetary</a>
                              </div>
                              <div className="btn-group btn-group btn-group-justified">
                                <a href="" className="btn font-green">
                                  <i className="fa fa-social-twitter"></i>
                                  {theBestChampion.recency} days</a>
                                <a href="" className="btn font-red">
                                  <i className="fa fa-bubbles"></i>
                                  {theBestChampion.frequency} SOs</a>
                                <a href="" className="btn font-yellow">
                                  <i className="fa fa-emotfa fa-smile"></i>
                                  {conciseNumber(theBestChampion.monetary, 3)}{` ${currency}`}
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="mt-widget-1">
                          <div className="mt-fa fa">
                            <h4 className="item-name primary-link">
                              The Best Loyal Customer
                            </h4>
                          </div>
                          <div className="mt-img">
                            <img className="img-responsive img-widget" src={images.loyal[country]}/></div>
                          <div className="mt-body">
                            <h3 className="mt-username">{theBestLoyal.name}</h3>
                            <p className="mt-user-title">{theBestLoyal.company}</p>
                            <div className="mt-stats">
                              <div className="btn-group btn-group btn-group-justified">
                                <a href="" className="btn font-green">Recency</a>
                                <a href="" className="btn font-red">Frequency</a>
                                <a href="" className="btn font-yellow">Monetary</a>
                              </div>
                              <div className="btn-group btn-group btn-group-justified">
                                <a href="" className="btn font-green">
                                  <i className="fa fa-social-twitter"></i>{theBestLoyal.recency} days</a>
                                <a href="" className="btn font-red">
                                  <i className="fa fa-bubbles"></i>{theBestLoyal.frequency} SOs</a>
                                <a href="" className="btn font-yellow">
                                  <i className="fa fa-emotfa fa-smile"></i>
                                  {conciseNumber(theBestLoyal.monetary, 3)}{` ${currency}`}
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="mt-widget-1">
                          <div className="mt-fa fa">
                            <h4 className="item-name primary-link">
                              The Best Potential Loyalist
                            </h4>
                          </div>
                          <div className="mt-img">
                            <img className="img-responsive img-widget" src={images.potential[country]}/></div>
                          <div className="mt-body">
                            <h3 className="mt-username">{theBestPotential.name}</h3>
                            <p className="mt-user-title">{theBestPotential.company}</p>
                            <div className="mt-stats">
                              <div className="btn-group btn-group btn-group-justified">
                                <a href="" className="btn font-green">Recency</a>
                                <a href="" className="btn font-red">Frequency</a>
                                <a href="" className="btn font-yellow">Monetary</a>
                              </div>
                              <div className="btn-group btn-group btn-group-justified">
                                <a href="" className="btn font-green">
                                  <i className="fa fa-social-twitter"></i>{theBestPotential.recency} days</a>
                                <a href="" className="btn font-red">
                                  <i className="fa fa-bubbles"></i>{theBestPotential.frequency}SOs</a>
                                <a href="" className="btn font-yellow">
                                  <i className="fa fa-emotfa fa-smile"></i>
                                  {conciseNumber(theBestPotential.monetary, 3)}{` ${currency}`}
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="portlet light bordered">
                  <div className="portlet-title tabbable-line">
                    <div className="caption">
                      <i className="icon-bubbles font-dark hide"></i>
                      <span className="caption-subject font-dark bold uppercase">{`Top 10 ${filterLabel}`}</span>
                    </div>
                    <div className="actions">
                      <div className="btn-group">
                        <a className="btn blue-oleo btn-circle btn-sm" data-toggle="dropdown"
                           data-hover="dropdown"
                           data-close-others="true"> {'Filter '}
                          <i className="fa fa-angle-down"></i>
                        </a>
                        <ul className="dropdown-menu pull-right">
                          {filters.map(({name, label}) => {
                            return (
                              <li key={name}>
                                <a onClick={e => {
                                e.preventDefault();
                                this._onChangeFilter(name);
                                }}>{label}</a>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="portlet-body">
                    <div className="tab-content">
                      <div className="tab-pane active" id="portlet_comments_1">
                        <div className="mt-comments">
                          {this._renderTopTen()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div>Loading...</div>
      );
    }
  }
}

RFM.propTypes = {};

const RFMContainer = createContainer(() => {
  const
    country = FlowRouter.getParam('country'),
    subSB = Meteor.subscribe('rfm.scoreboard', country),
    subTT = Meteor.subscribe('rfm.topten', country),
    ready = subSB.ready() && subTT.ready(),
    ScoreBoard = RFMScoreBoard.find().fetch(),
    TopTen = RFMTopTen.find().fetch();
  let currency = 'VND';
  if(country === 'kh') {
    currency = 'KHR';
  }
  if(country === 'la') {
    currency = 'LAK';
  }

  return {
    ready,
    country,
    currency,
    ScoreBoard,
    TopTen
  };
}, RFM);

export default RFMContainer