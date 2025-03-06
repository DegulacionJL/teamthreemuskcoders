import PropTypes from 'prop-types';
import React from 'react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Avatar, Box, IconButton, Menu, MenuItem, Typography } from '@mui/material';

function getRelativeTime(timestamp) {
  const now = new Date();
  const postedTime = new Date(timestamp);
  const diff = Math.floor((now - postedTime) / 1000);

  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  return `${Math.floor(diff / 86400)} days ago`;
}

function MemePost({
  id,
  caption,
  image,
  timestamp,
  onDelete,
  onMenuOpen,
  onMenuClose,
  menuAnchor,
  isMenuOpen,
}) {
  return (
    <Box
      sx={{
        p: 2,
        backgroundColor: 'white',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
        maxWidth: '500px',
        margin: 'auto',
        mt: 4,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2,
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ mr: 2 }}>U</Avatar>
          <Typography variant="h6" gutterBottom>
            User
          </Typography>
        </Box>
        <Box>
          <Typography variant="caption" sx={{ color: 'gray' }}>
            {getRelativeTime(timestamp)}
          </Typography>

          <IconButton onClick={(event) => onMenuOpen(event, id)}>
            <MoreVertIcon />
          </IconButton>
        </Box>
        <Menu anchorEl={menuAnchor} open={isMenuOpen} onClose={onMenuClose}>
          <MenuItem onClick={() => onDelete(id)}>Edit</MenuItem>
          <MenuItem onClick={() => onDelete(id)} sx={{ color: 'red' }}>
            Delete
          </MenuItem>
        </Menu>
      </Box>

      <Typography variant="body1" sx={{ mb: 2 }}>
        {caption}
      </Typography>

      {image && <img src={image} alt="Meme" style={{ maxWidth: '100%', borderRadius: '8px' }} />}
    </Box>
  );
}

// ✅ Add PropTypes to define prop validation
MemePost.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  caption: PropTypes.string.isRequired,
  image: PropTypes.string,
  timestamp: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
  onMenuOpen: PropTypes.func.isRequired,
  onMenuClose: PropTypes.func.isRequired,
  menuAnchor: PropTypes.object,
  isMenuOpen: PropTypes.bool.isRequired,
};

export default MemePost;
