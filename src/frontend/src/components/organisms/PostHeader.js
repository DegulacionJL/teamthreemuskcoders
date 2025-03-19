import PropTypes from 'prop-types';
import React from 'react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
// Add this import
import { Box, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import AvatarWithInitials from '../atoms/AvatarWithInitials';
import RelativeTime from '../atoms/RelativeTime';

const PostHeader = ({
  user,
  timestamp,
  onMenuOpen,
  menuAnchor,
  isMenuOpen,
  onMenuClose,
  onEdit,
  onDelete,
}) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <AvatarWithInitials
          src={user?.avatar}
          firstName={user?.first_name}
          lastName={user?.last_name}
          alt={`${user?.first_name} ${user?.last_name}`}
        />
        <Typography variant="h6" sx={{ ml: 2 }}>
          {user ? `${user.first_name} ${user.last_name}` : 'Unknown User'}
        </Typography>
      </Box>
      <Box>
        <RelativeTime timestamp={timestamp} />
        <IconButton onClick={onMenuOpen}>
          <MoreVertIcon />
        </IconButton>
      </Box>
      <Menu anchorEl={menuAnchor} open={isMenuOpen} onClose={onMenuClose}>
        <MenuItem onClick={onEdit}>Edit</MenuItem>
        <MenuItem onClick={onDelete} sx={{ color: 'red' }}>
          Delete
        </MenuItem>
      </Menu>
    </Box>
  );
};

PostHeader.propTypes = {
  user: PropTypes.object.isRequired,
  timestamp: PropTypes.string.isRequired,
  onMenuOpen: PropTypes.func.isRequired,
  menuAnchor: PropTypes.object,
  isMenuOpen: PropTypes.bool.isRequired,
  onMenuClose: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default PostHeader;
