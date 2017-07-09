import React from 'react';
import MarkerClusterer from 'marker-clusterer-plus';
/**
* Clusters `<Marker />` components passed as children in props.children

* @memberof Map
*
* @property {object} props
* @property {object} props.map The google.maps.Map object from the map component.
* @property {Array.<Map.Marker>} props.children These should only be {@link Marker} components.
* @property {MarkerClustererOptions} props.options The MarkerClusterer instantiates with these options.
* @property {object} state The state of the MarkerCluster component.
* @property {MarkerClusterer} state.MarkerClusterer The instance of {@link MarkerClusterer} for this component.
*
*
*/
class MarkerCluster extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'MarkerCluster';
        this.state = {
          ready: false,
        	MarkerClusterer : null
        }
    }
    componentWillUpdate() {
        // this.state.MarkerClusterer.clearMarkers();
    }
    componentWillMount() {
    	if(this.props.map && this.props.maps) {
	    	var options = {gridSize: 50, maxZoom: 15}

	    	if(this.props.options)
	    		options = Object.assign(options, this.props.options);

	    	this.setState({
          ready: true,
	    		MarkerClusterer : new MarkerClusterer(this.props.map, [], options)
	    	});
    	}
    	else {
    		console.error(new Error("You must run <MarkerCluster /> components within the context of a <Map /> component. Otherwise, provide the maps and map props manually."));
    		// this.setState({ready: false});
    	}
    }
    componentWillUnmount() {
    	var {MarkerClusterer} = this.state;
    	if(MarkerClusterer) {
    		MarkerClusterer.clearMarkers();
    	}
	    this.setState({MarkerClusterer : null})
    }
    componentDidUpdate() {
    	if(this.state.MarkerClusterer)
    		this.state.MarkerClusterer.repaint();
    }
    render() {
    	var children = [];
    	var {map, maps} = this.props;
    	const {ready} = this.state;
    	if(ready) {
        if(this.props.map && this.props.maps && this.state.MarkerClusterer)
          children = React.Children.map(this.props.children, child => React.cloneElement(child, {
            MarkerClusterer : this.state.MarkerClusterer,
            map,
            maps
          }));
        return <div>{children}</div>;
      } else {
    	  return null;
      }
    }
}

MarkerCluster.propTypes = {
	map : React.PropTypes.object,
	maps : React.PropTypes.object,
	options : React.PropTypes.object
}

export default MarkerCluster;
