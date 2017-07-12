import React, {Component} from 'react';

class Portlet extends Component {
  render() {
    return (
      <div className="col-md-12">
        {/* information */}
        <div className="portlet light bordered">
          <div className="portlet-title">
            {/* Caption */}
            <div className="caption">
              <i className="icon-settings font-red-mint"></i>
              <span className="caption-subject font-red-mint bold uppercase">Button Groups</span>
            </div>
            {/* Dropdown Actions */}
            <div className="actions">
              <div className="btn-group">
                <a className="btn btn-circle green-haze btn-outline btn-circle btn-sm" href="javascript:;" data-toggle="dropdown" data-hover="dropdown" data-close-others="true"> Actions
                  <i className="fa fa-angle-down"></i>
                </a>
                <ul className="dropdown-menu pull-right">
                  <li>
                    <a href="javascript:;">
                      <i className="i"></i> Option 1</a>
                  </li>
                  <li className="divider"> </li>
                  <li>
                    <a href="javascript:;">Option 2</a>
                  </li>
                  <li>
                    <a href="javascript:;">Option 3</a>
                  </li>
                  <li>
                    <a href="javascript:;">Option 4</a>
                  </li>
                </ul>
              </div>
            </div>
            {/* Portlet Options */}
            <div className="actions">
              <a className="btn btn-circle btn-icon-only btn-default" href="javascript:;">
                <i className="icon-cloud-upload"></i>
              </a>
              <a className="btn btn-circle btn-icon-only btn-default" href="javascript:;">
                <i className="icon-wrench"></i>
              </a>
              <a className="btn btn-circle btn-icon-only btn-default" href="javascript:;">
                <i className="icon-trash"></i>
              </a>
            </div>
          </div>
          <div className="portlet-body">
            <div className="clearfix">
              <h4 className="block">Basic Example</h4>
              <div className="btn-group">
                <button type="button" className="btn btn-default">Left</button>
                <button type="button" className="btn btn-default">Middle</button>
                <button type="button" className="btn btn-default">Right</button>
              </div>
              <div className="btn-group btn-group-solid">
                <button type="button" className="btn red">Left</button>
                <button type="button" className="btn yellow">Middle</button>
                <button type="button" className="btn green">Right</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

