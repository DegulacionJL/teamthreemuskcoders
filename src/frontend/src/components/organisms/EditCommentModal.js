import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import ImagePreview from '../atoms/ImagePreview';
import ImageUploadButton from '../atoms/ImageUploadButton';

function EditCommentModal({ open, onClose, commentId, currentText, currentImage, onSave }) {
  const [text, setText] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [shouldUpdateImage, setShouldUpdateImage] = useState(false);

  useEffect(() => {
    if (open) {
      setText(currentText || '');
      setImagePreview(currentImage || null);
      setImageBase64(null);
      setShouldUpdateImage(false);
    }
  }, [open, currentText, currentImage]);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        setImagePreview(URL.createObjectURL(file));
        setImageBase64(reader.result);
        setShouldUpdateImage(true);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageBase64(null);
    setShouldUpdateImage(true);
  };

  const handleSave = () => {
    onSave(commentId, text, shouldUpdateImage ? imageBase64 : undefined);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Comment</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          multiline
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
          margin="normal"
        />

        <ImagePreview src={imagePreview} onRemove={handleRemoveImage} />

        <Box sx={{ mt: 2 }}>
          <ImageUploadButton onChange={handleImageChange} disabled={!!imageBase64} />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} color="primary" variant="contained">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}

EditCommentModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  commentId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  currentText: PropTypes.string,
  currentImage: PropTypes.string,
  onSave: PropTypes.func.isRequired,
};

export default EditCommentModal;
