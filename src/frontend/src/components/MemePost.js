import PropTypes from 'prop-types';
import React, { useState } from 'react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Avatar, Box, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import EditPostModal from './organisms/EditPostModal';

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
  onUpdate,
  onMenuOpen,
  onMenuClose,
  menuAnchor,
  isMenuOpen,
}) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // State to control modal visibility
  const [currentCaption, setCurrentCaption] = useState(caption); // State to hold the caption being edited
  const [currentImage, setCurrentImage] = useState(image); // State to hold the image being edited

  const handleSave = (newCaption, newImage) => {
    setCurrentCaption(newCaption); // Update the caption
    setCurrentImage(newImage); // Update the image
    onDelete(id); // Assuming onDelete handles the update operation, change it if needed
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
          <MenuItem onClick={() => onUpdate(id, caption, image)}>Edit</MenuItem>

          <MenuItem onClick={() => onDelete(id)} sx={{ color: 'red' }}>
            Delete
          </MenuItem>
        </Menu>
      </Box>

      <Typography variant="body1" sx={{ mb: 2 }}>
        {currentCaption}
      </Typography>

      {currentImage && (
        <img src={currentImage} alt="Meme" style={{ maxWidth: '100%', borderRadius: '8px' }} />
      )}

      {/* EditPostModal Integration */}
      <EditPostModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        currentCaption={currentCaption}
        currentImage={currentImage}
        onSave={handleSave}
      />
    </Box>
  );
}

MemePost.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  caption: PropTypes.string.isRequired,
  image: PropTypes.string,
  timestamp: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
  onUpdate: PropTypes.func,
  onMenuOpen: PropTypes.func.isRequired,
  onMenuClose: PropTypes.func.isRequired,
  menuAnchor: PropTypes.object,
  isMenuOpen: PropTypes.bool.isRequired,
};

export default MemePost;
