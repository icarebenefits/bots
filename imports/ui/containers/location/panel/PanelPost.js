import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';

class PanelPost extends Component {
  render() {
    const {visible, onApply} = this.props;

    return (
      <div className={classNames({"tab-pane ": true, "active": visible})}>
        <div className="row">
          <div className="col-md-10 col-xs-12">
            <form className="form-inline margin-bottom-40" role="form">
              <button
                type="button"
                className="btn green margin-top-30"
                onClick={e => {
                  e.preventDefault();
                  onApply('post');
                }}
              >Post</button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
;

PanelPost.propTypes = {
  visible: PropTypes.bool,
  onApply: PropTypes.func
};

export default PanelPost