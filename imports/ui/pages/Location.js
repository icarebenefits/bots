import React, {Component, PropTypes} from 'react';
import FaCog from 'react-icons/lib/fa/cog';
import {GoogleMaps} from '/imports/ui/google';


// Components
import {Spinner} from '/imports/ui/components/common';

class Location extends Component {

  render() {
    const {ready = true} = this.props;

    if (ready) {
      return (
        <div className="page-content-col">
          <div className="breadcrumbs">
          <h1>Field Sales Locations</h1>
          <ol className="breadcrumb">
            <li>
              <a href="#">Vietnam</a>
            </li>
            <li>
              <a href="#">Last 1 hour</a>
            </li>
          </ol>
        </div>
          <div class="search-page search-content-2">
            <div className="search-page search-content-2">
              <div className="search-bar bordered">
                <div className="row">
                  <div className="col-md-12">
                    <div className="input-group">
                      <input type="text" className="form-control" placeholder="Search for... name, email, or userId"/>
                      <span className="input-group-btn">
                        <button className="btn blue uppercase bold" type="button">Search</button>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <div className="search-container bordered">
                    <GoogleMaps/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <Spinner/>
        </div>
      );
    }
  }
}

Location.propTypes = {};

export default Location
