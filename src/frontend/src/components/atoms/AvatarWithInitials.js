import PropTypes from 'prop-types';
import React from 'react';
import { Avatar } from '@mui/material';

const AvatarWithInitials = ({ src, firstName, lastName, alt }) => {
  const getInitials = (firstName, lastName) => {
    if (!firstName && !lastName) return 'U';
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`;
  };

  return (
    <Avatar src={src} alt={alt}>
      {getInitials(firstName, lastName)}
    </Avatar>
  );
};

AvatarWithInitials.propTypes = {
  src: PropTypes.string,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  alt: PropTypes.string,
};

export default AvatarWithInitials;
