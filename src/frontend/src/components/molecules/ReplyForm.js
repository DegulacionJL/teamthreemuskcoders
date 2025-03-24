import PropTypes from 'prop-types';
import React, { useState } from 'react';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { Box, Button, IconButton, TextField } from '@mui/material';
import ImagePreview from '../atoms/ImagePreview';

const ReplyForm = ({ commentId, onSubmit, onCancel }) => {
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = () => {
    if (!text.trim() && !image) return;
    onSubmit(commentId, text, image);
    setText('');
    setImage(null);
    setImagePreview(null);
  };

  return (
    <Box sx={{ mt: 2, ml: 2 }}>
      <TextField
        fullWidth
        size="small"
        placeholder="Write a reply..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        sx={{ mb: 1 }}
      />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <input
          accept="image/*"
          style={{ display: 'none' }}
          id={`reply-image-upload-${commentId}`}
          type="file"
          onChange={handleImageChange}
        />
        <label htmlFor={`reply-image-upload-${commentId}`}>
          <IconButton component="span" color="primary" size="small">
            <AddPhotoAlternateIcon fontSize="small" />
          </IconButton>
        </label>
        <Button variant="contained" size="small" onClick={handleSubmit}>
          Reply
        </Button>
        <Button size="small" onClick={onCancel}>
          Cancel
        </Button>
      </Box>
      {imagePreview && (
        <ImagePreview src={imagePreview} onRemove={() => setImagePreview(null)} maxHeight="80px" />
      )}
    </Box>
  );
};

ReplyForm.propTypes = {
  commentId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default ReplyForm;
