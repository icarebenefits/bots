import React from 'react';

/* Components */
import LoginButton from './LoginButton';

const UserProfile = (props) => {
  const {profile} = props;
  if (!profile) {
    return (
      <div className="btn-group-img btn-group" style={{top: 20}}>
        <LoginButton />
      </div>
    );
  } else {
    return (
      <div>
        user profile
      </div>
    );
  }
};

UserProfile.propTypes = {};

export default UserProfile