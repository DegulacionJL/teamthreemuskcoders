import PropTypes from 'prop-types';
import React, { useState } from 'react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Box, IconButton, Menu, MenuItem } from '@mui/material';

const CommentActions = ({ onEdit, onDelete, onReport, isOwner }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <IconButton onClick={handleOpenMenu} size="small">
        <MoreVertIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseMenu}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {isOwner && onEdit && (
          <MenuItem
            onClick={() => {
              handleCloseMenu();
              onEdit();
            }}
          >
            Edit
          </MenuItem>
        )}
        {isOwner && onDelete && (
          <MenuItem
            onClick={() => {
              handleCloseMenu();
              onDelete();
            }}
            sx={{ color: 'red' }}
          >
            Delete
          </MenuItem>
        )}
        {!isOwner && (
          <MenuItem
            onClick={() => {
              handleCloseMenu();
              onReport();
            }}
            sx={{ color: 'red' }}
          >
            Report
          </MenuItem>
        )}
      </Menu>
    </Box>
  );
};

CommentActions.propTypes = {
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onReport: PropTypes.func.isRequired,
  isOwner: PropTypes.bool.isRequired,
};

export default CommentActions;
