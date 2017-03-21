import React, {Component, PropTypes} from 'react';

class Blank extends Component {
  render() {
    return (
      <div className="page-content-col">
        {/* Page Content goes here */}
        <div className="row">
          <h2>First Page Row</h2>
          <div className="col-md-12">
            <h4>First column of first Row</h4>
          </div>
        </div>

        <div className="row">
          <h2>Second Page Row</h2>
          <div className="col-md-12">
            <h4>First column of second Row</h4>
          </div>
        </div>
      </div>
    );
  }
}

Blank.propTypes = {};

export default Blank