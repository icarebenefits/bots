import React, {Component, PropTypes} from 'react';

// components
import {
  List,
  Toolbar,
  ListHeader,
  ListFooter
} from '../../components';

const ListSLAs = (props) => {
  const {toolbar, list, handleChangeMode, handleActionSLA} = props;

  return (
    <div className="row">
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
    </div>
  );
}

ListSLAs.propTypes = {
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

export default ListSLAs
