import PropTypes from 'prop-types';
import React from 'react';
import { Box, Typography } from '@mui/material';
import AvatarWithInitials from 'components/atoms/AvatarWithInitial';

const UserInfo = ({ user, avatarSx = { mr: 2 } }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <AvatarWithInitials user={user} sx={avatarSx} />
      <Typography variant="h6">
        {user ? `${user.first_name} ${user.last_name}` : 'Unknown User'}
      </Typography>
    </Box>
  );
};

UserInfo.propTypes = {
  user: PropTypes.object.isRequired,
  avatarSx: PropTypes.object,
};

export default UserInfo;
