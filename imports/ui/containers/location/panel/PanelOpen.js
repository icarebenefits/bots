import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';
// components
import {Suggest} from '/imports/ui/components/elements';

class PanelOpen extends Component {
  render() {
    const {visible} = this.props;
    return (
      <div className={classNames({"tab-pane": true, "active": visible})}>
        <div className="row">
          <div className="col-md-10 col-xs-12">
            <form className="form-inline margin-bottom-40" role="form">
              <div className="form-group form-md-line-input has-success margin-top-30">
                <Suggest
                  className="form-control"
                  options={[
                    {name: 'second', label: 'Seconds ago'},
                    {name: 'minute', label: 'Minutes ago'},
                    {name: 'hour', label: 'Hours ago'},
                    {name: 'day', label: 'Days ago'},
                    {name: 'week', label: 'Weeks ago'},
                    {name: 'month', label: 'Months ago'},
                    {name: 'year', label: 'Years ago'},
                  ]}
                />
              </div>
              <button type="button" className="btn green margin-top-30">Open</button>
            </form>
          </div>
        </div>
      </div>
    );
  }
};

PanelOpen.propTypes = {};

export default PanelOpen