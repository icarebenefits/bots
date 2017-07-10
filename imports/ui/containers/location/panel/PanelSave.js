import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';

// components
import {FormInput} from '/imports/ui/components/elements';

class PanelSave extends Component {
  render() {
    const {visible} = this.props;

    return (
      <div className={classNames({"tab-pane ": true, "active": visible})}>
        <div className="row">
          <div className="col-md-10 col-xs-12">
            <form className="form-inline margin-bottom-40" role="form">
              <div className="form-group form-md-line-input has-success margin-top-30">
                <input type="text" className="form-control" placeholder="Search Name"/>
              </div>
              <button type="button" className="btn green margin-top-30">Save</button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
;

PanelSave.propTypes = {
  visible: PropTypes.bool
};

export default PanelSave