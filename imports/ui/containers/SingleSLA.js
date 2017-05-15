import React, {Component, PropTypes} from 'react';

class SingleSLA extends Component {
  render() {
    const {mode} = this.props;
    return (
      <div>
        {`Single SLA ${mode}`}
      </div>
    );
  }
}

SingleSLA.propTypes = {};

export default SingleSLA