import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Box, Button, TextField } from '@mui/material';
import ImagePreview from '../atoms/ImagePreview';
import ImageUploadButton from './ImageUploadButton';

const CommentInputForm = ({
  placeholder = 'Add a comment...',
  onSubmit,
  buttonText = 'Comment',
  submitBtnVariant = 'contained',
}) => {
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
    onSubmit(text, image);
    setText('');
    setImage(null);
    setImagePreview(null);
  };

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, gap: 1 }}>
        <TextField
          fullWidth
          size="small"
          placeholder={placeholder}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <ImageUploadButton onChange={handleImageChange} id="comment-image-upload" />
        <Button variant={submitBtnVariant} onClick={handleSubmit}>
          {buttonText}
        </Button>
      </Box>
      {imagePreview && <ImagePreview src={imagePreview} onRemove={() => setImagePreview(null)} />}
    </>
  );
};

CommentInputForm.propTypes = {
  placeholder: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
  buttonText: PropTypes.string,
  submitBtnVariant: PropTypes.string,
};

export default CommentInputForm;
