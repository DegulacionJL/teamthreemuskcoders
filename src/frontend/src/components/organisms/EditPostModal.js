'use client';

import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';

const EditPostModal = ({ open, onClose, caption, image, onSave }) => {
  const [editedCaption, setEditedCaption] = useState('');
  const [editedImage, setEditedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [removeImage, setRemoveImage] = useState(false);

  useEffect(() => {
    if (open) {
      // Reset state when modal opens
      setEditedCaption(caption || '');
      setImagePreview(image || '');
      setEditedImage(null);
      setRemoveImage(false);
      setIsSubmitting(false);
    }
  }, [open, caption, image]);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setEditedImage(file);
      setImagePreview(URL.createObjectURL(file));
      setRemoveImage(false);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview('');
    setEditedImage(null);
    setRemoveImage(true);
  };

  const handleSave = async () => {
    try {
      setIsSubmitting(true);
      await onSave(editedCaption, editedImage, removeImage);
      onClose();
    } catch (error) {
      console.error('Error saving post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    // Discard changes and close
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      maxWidth="sm"
      fullWidth
      disableEscapeKeyDown={isSubmitting} // Prevent closing while submitting
    >
      <DialogTitle>Edit Post</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Caption"
          type="text"
          fullWidth
          multiline
          rows={4}
          value={editedCaption}
          onChange={(e) => setEditedCaption(e.target.value)}
          disabled={isSubmitting}
        />

        {imagePreview ? (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <img
              src={imagePreview || '/placeholder.svg'}
              alt="Preview"
              style={{
                maxWidth: '100%',
                maxHeight: '200px',
                borderRadius: '8px',
                display: 'block',
                margin: 'auto',
              }}
            />
            <Button
              variant="outlined"
              color="error"
              onClick={handleRemoveImage}
              sx={{ mt: 1 }}
              disabled={isSubmitting}
            >
              Remove Image
            </Button>
          </Box>
        ) : (
          <Box sx={{ mt: 2 }}>
            <Button variant="outlined" component="label" disabled={isSubmitting}>
              Add Image
              <input type="file" hidden accept="image/*" onChange={handleImageChange} />
            </Button>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary" variant="contained" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
              Saving...
            </>
          ) : (
            'Save'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

EditPostModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  caption: PropTypes.string,
  image: PropTypes.string,
  onSave: PropTypes.func.isRequired,
};

export default EditPostModal;
