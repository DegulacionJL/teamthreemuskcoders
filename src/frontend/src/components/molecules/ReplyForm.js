import { autoUpdate, flip, offset, shift, useFloating } from '@floating-ui/react';
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

  const { refs, floatingStyles } = useFloating({
    open: showEmojiPicker,
    placement: 'bottom-end',
    middleware: [offset(4), flip(), shift()],
    whileElementsMounted: autoUpdate,
    elements: { reference: emojiButtonRef.current },
  });

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleEmojiClick = (emojiObject) => {
    setText((prevText) => prevText + emojiObject.emoji);
  };

  const handleSubmit = () => {
    if (!text.trim() && !image) return;
    onSubmit(commentId, text, image);
    setText('');
    setImage(null);
    setImagePreview(null);
    setShowEmojiPicker(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.shiftKey) {
      // Allow Shift+Enter to add a new line
      e.preventDefault();
      const cursorPosition = e.target.selectionStart; // Get the current cursor position
      const newText = text.slice(0, cursorPosition) + '\n' + text.slice(cursorPosition); // Insert a new line at the cursor position
      setText(newText);

      // Move the cursor to the correct position after the new line
      setTimeout(() => {
        e.target.setSelectionRange(cursorPosition + 1, cursorPosition + 1);

        // Scroll the TextField to ensure the cursor is visible
        const inputElement = e.target;
        inputElement.scrollTop = inputElement.scrollHeight; // Scroll to the bottom of the TextField
      }, 0);
    } else if (e.key === 'Enter') {
      // Submit the form when Enter is pressed without Shift
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Box sx={{ mt: 2, ml: 2, position: 'relative' }}>
      <TextField
        fullWidth
        size="small"
        placeholder="Write a reply..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        sx={{ mb: 1 }}
        multiline // Enable multiline input
        rows={2} // Set initial rows
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
          ref={refs.setFloating}
          style={{
            ...floatingStyles,
            zIndex: 1000,
            position: 'absolute',
          }}
        >
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </Box>
      )}
      {imagePreview && (
        <ImagePreview
          src={imagePreview}
          onRemove={() => {
            setImage(null);
            setImagePreview(null);
          }}
          maxHeight="80px"
        />
      )}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
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
    </Box>
  );
};

ReplyForm.propTypes = {
  commentId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default ReplyForm;
