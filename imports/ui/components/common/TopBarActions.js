import React, {PropTypes} from 'react';
import UserProfile from './UserProfile';

const TopBarActions = (props) => {
  return (
    <div className="topbar-actions">
      {/* GROUP NOTIFICATION */}

      {/* GROUP INFORMATION */}

      {/* USER PROFILE */}
      <UserProfile />

      {/* QUICK SIDEBAR TOGGLER */}

    </div>
  );
};

TopBarActions.propTypes = {};

export default TopBarActions