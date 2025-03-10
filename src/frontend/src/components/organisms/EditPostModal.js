import React, { useState } from 'react';
import { Modal, Box, Button, Typography } from '@mui/material';
import CaptionInput from 'components/atoms/CaptionInput';
import ImageEditor from 'components/molecules/ImageEditor';

function EditPostModal({ open, onClose, currentCaption, currentImage, onSave }) {
  const [caption, setCaption] = useState(currentCaption);
  const [image, setImage] = useState(currentImage);

  const handleCaptionChange = (e) => {
    setCaption(e.target.value);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handleImageRemove = () => {
    setImage(null);
  };

  const handleSave = () => {
    onSave(caption, image);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          padding: 3,
          backgroundColor: 'white',
          borderRadius: '8px',
          maxWidth: '500px',
          margin: 'auto',
          marginTop: '100px',
          maxHeight: '80vh', // Adjust the height as needed
          overflowY: 'auto', // Allow scrolling if content exceeds the height
        }}
      >
        <Typography variant="h6" gutterBottom>
          Edit Post
        </Typography>
        <CaptionInput value={caption} onChange={handleCaptionChange} />
        <ImageEditor
          image={image}
          onImageChange={handleImageChange}
          onImageRemove={handleImageRemove}
        />
        <Button onClick={handleSave} variant="contained" sx={{ mt: 2 }}>
          Save Changes
        </Button>
      </Box>
    </Modal>
  );
}

export default EditPostModal;
