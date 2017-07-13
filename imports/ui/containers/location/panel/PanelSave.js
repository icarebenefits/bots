import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';
import _ from 'lodash';

// Functions
import {warning} from '/imports/api/notifications';

class PanelSave extends Component {
  render() {
    const {visible, name = '', onApply} = this.props;

    return (
      <div className={classNames({"tab-pane ": true, "active": visible})}>
        <div className="row">
          <div className="col-md-10 col-xs-12">
            <form className="form-inline margin-bottom-40" role="form">
              <div className="form-group form-md-line-input has-success margin-top-30">
                <input
                  type="text"
                  ref="name"
                  className="form-control"
                  placeholder="GEO SLA Name"
                  defaultValue={name}
                />
              </div>
              <button
                type="button"
                className="btn green margin-top-30"
                onClick={e => {
                  e.preventDefault();
                  const name = this.refs.name.value;
                  if(_.isEmpty(name)) {
                    return warning({title: 'VALIDATE SLA NAME', message: 'Name is empty.'})
                  }
                  return onApply('save', {name});
                }}
              >Save</button>
            </form>
          </div>z
        </div>
      </div>
    );
  }
}
;

PanelSave.propTypes = {
  visible: PropTypes.bool,
  name: PropTypes.string,
  onApply: PropTypes.func
};

export default PanelSave