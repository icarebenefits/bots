import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';
import _ from 'lodash';

// components
import {PanelSave, PanelOpen, PanelCountry, PanelTimeRange} from './panel';
// constants
import {NAV_CONST, COUNTRY_CONST} from './CONSTANTS';

class MapsNav extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTab: '',
      name: props.name || '',
      timeRange: props.timeRange || {from: 'now/d', to: 'now/d', label: 'Today', mode: 'quick'},
      timeRangeLabel: this._getTimeRangeLabel(props.timeRange),
      country: props.country || 'vn',
      countryLabel: this._getCountryLabel(props.country)
    };

    /* Handlers */
    // private
    this._onClickTab = this._onClickTab.bind(this);

    // public
    this.onApplyPanel = this.onApplyPanel.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    console.log('nextProps', nextProps);
    const {name, timeRange, country} = this.props;
    if(name !== nextProps.name) {
      this.setState({name: nextProps.name});
    }
    if(timeRange.from !== nextProps.timeRange.from ||
      timeRange.to !== nextProps.timeRange.to ||
      timeRange.label !== nextProps.timeRange.label ||
      timeRange.mode !== nextProps.timeRange.mode) {
      this.setState({
        timeRange: nextProps.timeRange,
        timeRangeLabel: this._getTimeRangeLabel(nextProps.timeRange)
      });
    }
    if(country !== nextProps.country) {
      this.setState({
        country: nextProps.country,
        countryLabel: this._getCountryLabel(nextProps.country)
      });
    }
  }

  _getTimeRangeLabel(timeRange) {
    if(_.isEmpty(timeRange)) {
      return 'Today';
    }

    return timeRange.label;
  }

  _getCountryLabel(country) {
    console.log('country', country);
    if(!_.isEmpty(country)) {
      const labels = COUNTRY_CONST.buttons.filter(c => c.name === country);
      if(!_.isEmpty(labels)) {
        return labels[0].label;
      }
    }

    return 'Vietnam';
  }

  onApplyPanel(panel, data) {
    this.setState({
      activeTab: '',
      ...data
    }, this.props.onApply(panel, {
      ...this.state,
      ...data
    }));
  }

  _onClickTab(name) {
    switch (name) {
      case 'refresh': {
        console.log('gonna refresh the filters');
        break;
      }
    }
    this.setState({
      activeTab: this.state.activeTab !== name ? name : ''
    });
  }

  render() {
    const
      {activeTab, name, timeRange, timeRangeLabel, country, countryLabel} = this.state,
      {title} = this.props,
      {tabs} = NAV_CONST;

    console.log('maps nav state', this.state);

    return (
      <div>
        <div className="breadcrumbs">
          <h1>{title}</h1>
          <ol className="breadcrumb">
            {tabs.map(tab => (
              <li key={tab.name}>
                <a className={classNames({'active': activeTab === tab.name})} onClick={e => {
                  e.preventDefault();
                  this._onClickTab(tab.name)
                }}><i className={`fa ${tab.icon}`}/>{' '}{this.state[`${tab.name}Label`] || tab.label}</a>
              </li>
            ))}
          </ol>
        </div>
        {(!_.isEmpty(activeTab) && activeTab !== 'refresh') && (
          <div className="portlet light bordered">
            <div className="portlet-title">
              <div className="caption font-green-sharp">
                <i className="fa fa-clock font-green-sharp"></i>
                <span className="caption-subject bold uppercase">{activeTab}</span>
              </div>
            </div>
            <div className="portlet-body">
              <div className="tab-content">
                <PanelSave
                  visible={activeTab === 'save'}
                  name={name}
                  onApply={this.onApplyPanel}
                />
                <PanelOpen
                  visible={activeTab === 'open'}
                  onApply={this.onApplyPanel}
                />
                <PanelCountry
                  visible={activeTab === 'country'}
                  country={country}
                  onApply={this.onApplyPanel}
                />
                <PanelTimeRange
                  visible={activeTab === 'timeRange'}
                  timeRange={timeRange}
                  onApply={this.onApplyPanel}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

MapsNav.propTypes = {
  title: PropTypes.string,
  onApply: PropTypes.func
};

export default MapsNav