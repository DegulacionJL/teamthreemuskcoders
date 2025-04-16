import PropTypes from 'prop-types';
import React from 'react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Box, IconButton, Menu, MenuItem } from '@mui/material';
import TimeDisplay from '../atoms/TimeDisplay';
import UserInfo from './UserInfo';

const PostHeader = ({
  user,
  timestamp,
  onMenuOpen,
  onMenuClose,
  menuAnchor,
  isMenuOpen,
  id,
  onEdit,
  onDelete,
}) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
      <UserInfo user={user} />
      <Box>
        <TimeDisplay timestamp={timestamp} />
        <IconButton onClick={(event) => onMenuOpen(event, id)}>
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
  onMenuClose: PropTypes.func.isRequired,
  menuAnchor: PropTypes.object,
  isMenuOpen: PropTypes.bool.isRequired,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default PostHeader;
