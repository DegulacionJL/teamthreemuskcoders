import React, { useEffect, useState } from 'react';
import { Box, Button, Modal, Typography } from '@mui/material';

function EditPostModal({ open, onClose, currentCaption, currentImage, onSave }) {
  const [caption, setCaption] = useState(currentCaption);
  const [image, setImage] = useState(currentImage);
  const [imagePreview, setImagePreview] = useState(null);
  const [key, setKey] = useState(Date.now());

  useEffect(() => {
    setCaption(currentCaption);
    setImage(currentImage);

    if (typeof currentImage === 'string') {
      setImagePreview(currentImage); // Use as URL
    } else if (currentImage instanceof File) {
      setImagePreview(URL.createObjectURL(currentImage)); // Generate preview
    }
  }, [currentCaption, currentImage]);

  const handleCaptionChange = (e) => setCaption(e.target.value);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setImage(file);
        setKey(Date.now());
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageRemove = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleSave = async () => {
    try {
      if (caption.trim()) {
        await onSave(caption, image); // Call parent function from MemeFeed
      }
      onClose(); // Close modal after saving
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%', // Make sure it's not too wide
          maxWidth: '500px',
          maxHeight: '80vh', // Prevent overflowing the screen
          overflowY: 'auto', // Enable vertical scrolling if needed
          bgcolor: 'white',
          boxShadow: 24,
          p: 3,
          borderRadius: '8px',
        }}
      >
        <Typography variant="h6" gutterBottom>
          Edit Post
        </Typography>

        <textarea
          value={caption}
          onChange={handleCaptionChange}
          style={{ width: '100%', minHeight: '100px', marginBottom: '10px' }}
        />

        <input type="file" onChange={handleImageChange} accept="image/*" />

        {imagePreview && (
          <Box sx={{ mt: 2 }}>
            <img
              src={imagePreview}
              alt="Preview"
              style={{ maxWidth: '100%', borderRadius: '8px' }}
            />
            <Button onClick={handleImageRemove} sx={{ display: 'block', mt: 1 }}>
              Remove Image
            </Button>
          </Box>
        )}

        <Button
          onClick={handleSave}
          variant="contained"
          sx={{ mt: 2, display: 'block', width: '100%' }}
        >
          Save Changes
        </Button>
      </Box>
    </Modal>
  );
}

export default EditPostModal;
