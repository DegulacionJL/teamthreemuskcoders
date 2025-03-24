import PropTypes from 'prop-types';
import React from 'react';
import { Avatar } from '@mui/material';

const getInitials = (firstName, lastName) => {
  if (!firstName && !lastName) return 'U';
  return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`;
};

const AvatarWithInitials = ({ user, sx = {} }) => {
  return (
    <Avatar src={user?.avatar || ''} sx={sx} alt={user?.full_name || 'User'}>
      {getInitials(user?.first_name, user?.last_name)}
    </Avatar>
  );
};

AvatarWithInitials.propTypes = {
  user: PropTypes.object.isRequired,
  sx: PropTypes.object,
};

export default AvatarWithInitials;
