import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';
import _ from 'lodash';

// components
import {PanelSave, PanelOpen, PanelCountry, PanelTimeRange} from './panel';

class MapsNav extends Component {
  constructor() {
    super();

    this.state = {
      activeTab: ''
    };

    // private
    this._onClickTab = this._onClickTab.bind(this);
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
      {activeTab} = this.state,
      {title} = this.props,
      tabs = [
        {name: 'save', label: 'Save', icon: 'fa-save'},
        {name: 'open', label: 'Open', icon: 'fa-folder-open'},
        {name: 'refresh', label: 'Refresh', icon: 'fa-refresh'},
        {name: 'country', label: 'Vietnam', icon: 'fa-globe'},
        {name: 'timeRange', label: 'July 9th 2017', icon: 'fa-clock-o'}
      ];
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
                }}><i className={`fa ${tab.icon}`} />{' '}{tab.label}</a>
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
                />
                <PanelOpen
                  visible={activeTab === 'open'}
                />
                <PanelCountry
                  visible={activeTab === 'country'}
                />
                <PanelTimeRange
                  visible={activeTab === 'timeRange'}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

MapsNav.propTypes = {};

export default MapsNav