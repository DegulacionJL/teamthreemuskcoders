import EmojiPicker from 'emoji-picker-react';
import PropTypes from 'prop-types';
import React, { useRef, useState } from 'react';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import { Box, Button, IconButton, InputAdornment, TextField } from '@mui/material';
import ImagePreview from '../atoms/ImagePreview';

const ReplyForm = ({ commentId, onSubmit, onCancel }) => {
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiButtonRef = useRef(null);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleEmojiClick = (emojiObject) => {
    setText((prevText) => prevText + emojiObject.emoji);
    // Removed setShowEmojiPicker(false) to keep the emoji picker open
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
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                ref={emojiButtonRef}
                onClick={() => setShowEmojiPicker((prev) => !prev)}
                edge="end"
              >
                <EmojiEmotionsIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      {showEmojiPicker && (
        <Box
          sx={{
            position: 'absolute',
            zIndex: 10,
            mt: 1,
          }}
        >
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </Box>
      )}
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
