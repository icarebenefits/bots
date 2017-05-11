import {Meteor} from 'meteor/meteor';
import React, {Component, PropTypes} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {connect} from 'react-redux';

/* CONSTANTS */
import {LISTS} from '/imports/ui/store/constants';

/* Collections */
import {WorkplaceGroups} from '/imports/api/collections/workplaces';
import SLACollection from '/imports/api/collections/slas/slas';

/* Components */
import {List} from '/imports/ui/components';

const ListSLA = (props) => {
  const {toolbar} = props;
  return (
    <div className="col-md-12">
      {/*
       <Toolbar
       {...toolbar}
       />
       */}

      {/*<ListHeader />*/}
      <List
        {...LISTS['listSLA']}
        data={[
        ]}
        
      />

      {/*<ListFooter />*/}
    </div>
  );
};

ListSLA.propTypes = {
  toolbar: PropTypes.shape({
    buttons: PropTypes.arrayOf(
      PropTypes.object
    ),
    tools: PropTypes.arrayOf(
      PropTypes.object
    ),
  }),
  handleAction: PropTypes.func,
};

// const ListSLAContainer = createContainer((props) => {
//   const
//     {country} = props,
//     subWp = Meteor.subscribe('groups'),
//     subSLAs = Meteor.subscribe('slasList'),
//     ready = subWp.ready() && subSLAs.ready(),
//     Workplaces = WorkplaceGroups.find({country}).fetch(),
//     SLAsList = SLACollection.find({country}).fetch()
//     ;
//
//   return {
//     ready,
//     country,
//     Workplaces,
//     SLAsList,
//   };
// }, ListSLA);


const mapStateToProps = state => ({
  country: state.pageControl.country
});

export default connect(mapStateToProps)(ListSLA)
