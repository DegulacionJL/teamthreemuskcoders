import React, { useState } from 'react';
import { Box, Typography, Avatar, IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ReactionButton from 'components/atoms/ReactionButton';
import CommentSection from 'components/molecules/CommentSection';

function getRelativeTime(timestamp) {
  const now = new Date();
  const postedTime = new Date(timestamp);
  const diff = Math.floor((now - postedTime) / 1000); // Difference in seconds

  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  return `${Math.floor(diff / 86400)} days ago`;
}

function MemePost({ id, caption, image, timestamp, onDelete }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // Open menu handler
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Close menu handler
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Delete post
  const handleDelete = () => {
    onDelete(id);
    handleMenuClose();
  };

  return (
    <Box
      sx={{
        p: 2,
        backgroundColor: 'white',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
        maxWidth: '500px',
        margin: 'auto',
        mt: 2,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ mr: 2 }}>U</Avatar>
          <Typography variant="h6">User</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="caption" sx={{ color: 'gray', mr: 1 }}>
            {getRelativeTime(timestamp)}
          </Typography>
          <IconButton onClick={handleMenuOpen}>
            <MoreVertIcon />
          </IconButton>
          <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
            <MenuItem onClick={handleMenuClose}>Edit</MenuItem>
            <MenuItem onClick={handleDelete} sx={{ color: 'red' }}>Delete</MenuItem>
          </Menu>
        </Box>
      </Box>
      <Typography variant="body1" sx={{ mb: 2 }}>
        {caption}
      </Typography>
      {image && (
        <Box sx={{ mb: 2 }}>
          <img src={image} alt="Meme" style={{ maxWidth: '100%', borderRadius: '8px' }} />
        </Box>
      )}
      {/* Add Haha Reaction Button */}
      <ReactionButton />
      {/* Add Comment Section */}
      <CommentSection />
    </Box>
  );
}

export default MemePost;
