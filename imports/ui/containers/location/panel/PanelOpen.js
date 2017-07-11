import {Meteor} from 'meteor/meteor';
import React, {Component, PropTypes} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import classNames from 'classnames';
import _ from 'lodash';
// components
import {Suggest} from '/imports/ui/components/elements';
import {Spinner} from '/imports/ui/components/common';
// Collections
import {GEO_SLA} from '/imports/api/collections/geo';

class PanelOpen extends Component {

  constructor() {
    super();

    this.state = {
      name: ''
    };
  }

  _getNameSuggestOptions(geoList) {
    if (!geoList)
      return [];

    return geoList.map(geo => ({
      name: geo.name,
      label: ''
    }));
  }

  render() {
    const {visible, ready, geoList, onApply} = this.props;
    return (
      <div className={classNames({"tab-pane": true, "active": visible})}>
        <div className="row">
          <div className="col-md-10 col-xs-12">
            {ready ? (
              !_.isEmpty(geoList) ? (
                <form className="form-inline margin-bottom-40" role="form">
                  <div className="form-group form-md-line-input has-success margin-top-30">
                    <Suggest
                      className="form-control"
                      ref="name"
                      options={this._getNameSuggestOptions(geoList)}
                      handleOnChange={value => this.setState({name: value})}
                    />
                  </div>
                  <button
                    type="button"
                    className="btn green margin-top-30"
                    onClick={e => {
                      e.preventDefault();
                      onApply('open', {name: this.state.name});
                    }}
                  >Open</button>
                </form>
              ) : (
                <div>No GEO SLA found.</div>
              )
            ) : (
              <div>
                <Spinner/>
              </div>
            )
            }
          </div>
        </div>
      </div>
    );
  }
}

PanelOpen.propTypes = {
  visible: PropTypes.bool,
  onApply: PropTypes.func,
  ready: PropTypes.bool,
  geoList: PropTypes.array
};

export default createContainer(() => {
  const
    sub = Meteor.subscribe('geoSLAList'),
    ready = sub.ready(),
    geoList = GEO_SLA.find({}).fetch();

  return {
    ready,
    geoList
  };
}, PanelOpen)