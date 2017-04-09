import React, {PropTypes} from 'react';

// components
import {
  List,
  Toolbar,
} from '../../components';

const ListSLAs = (props) => {
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
