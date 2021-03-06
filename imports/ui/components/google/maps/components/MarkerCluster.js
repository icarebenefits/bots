import React, {Component} from 'react';
import MarkerClusterer from 'marker-clusterer-plus';

class MarkerCluster extends Component {

  // componentDidMount() {
  //   this._renderCluster();
  // }

  componentDidUpdate(prevProps) {
    if (prevProps.map !== this.props.map) {
      if(this.mCluster) {
        this.mCluster.clearMarkers();
      }
      this._renderCluster();
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.children !== this.props.children) {
      if(this.mCluster) {
        this.mCluster.clearMarkers();
      }
      this._renderCluster();
    }
  }

  componentWillUnmount() {
    if(this.mCluster) {
      this.mCluster.clearMarkers();
      this.mCluster = null;
    }
  }

  _renderChildren() {
    const {children} = this.props;

    if (!children || !this.mCluster) {
      return null;
    }

    return React.Children.map(children, c => {
      return React.cloneElement(c, {
        map: this.map,
        google: this.props.google,
        mapCenter: this.props.mapCenter,
        MarkerCluster: this.mCluster
      });
    })
  }

  _renderCluster() {
    const {map, google, options} = this.props;

    if (!google && !map) {
      return null;
    }

    this.mCluster = new MarkerClusterer(map, [], options);
    this.mCluster.clearMarkers();
    this._renderChildren();

    this.mCluster.repaint();
    this.forceUpdate();
  }

  render() {
    return <div ref="cluster">
      {this._renderChildren()}
    </div>;
  }
}

export default MarkerCluster