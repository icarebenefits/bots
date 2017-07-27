import React from 'react';
import PropTypes from 'prop-types';

// components
import {
  List,
  Toolbar,
} from '../../components';

const ListPlace = (props) => {
  const {toolbar, list} = props;

  return (
    <div className="col-md-12">
      <Toolbar
        {...toolbar}
      />

      {/*<ListHeader />*/}
      <List
        {...list}
      />
      {/*<ListFooter />*/}
    </div>
  );
}

ListPlace.propTypes = {
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

export default ListPlace
