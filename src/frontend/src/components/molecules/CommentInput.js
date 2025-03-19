import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Box, Button, Stack } from '@mui/material';
import CommentTextField from '../atoms/CommentTextField';
import ImagePreview from '../atoms/ImagePreview';
import ImageUploadButton from '../atoms/ImageUploadButton';

function CommentInput({ onSubmit }) {
  const [commentText, setCommentText] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);

  const handleTextChange = (e) => {
    setCommentText(e.target.value);
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        setImagePreview(URL.createObjectURL(file));
        setImageBase64(reader.result);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageBase64(null);
  };

  const handleSubmit = () => {
    if (commentText.trim() || imageBase64) {
      onSubmit(commentText, imageBase64);
      setCommentText('');
      setImagePreview(null);
      setImageBase64(null);
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <CommentTextField
        value={commentText}
        onChange={handleTextChange}
        placeholder="Add a comment..."
      />

      <ImagePreview src={imagePreview} onRemove={handleRemoveImage} />

      <Stack direction="row" justifyContent="space-between" alignItems="center" mt={1}>
        <ImageUploadButton onChange={handleImageChange} disabled={!!imagePreview} />

        <Button
          variant="contained"
          size="small"
          onClick={handleSubmit}
          disabled={!commentText.trim() && !imageBase64}
        >
          Post
        </Button>
      </Stack>
    </Box>
  );
}

CommentInput.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default CommentInput;
