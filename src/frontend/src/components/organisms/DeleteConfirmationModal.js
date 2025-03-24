import PropTypes from 'prop-types';
import React, { useState } from 'react';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';

const DeleteConfirmationModal = ({ open, onClose, onConfirm, title, content }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    try {
      setIsDeleting(true);
      // Wait for deletion to complete
      await onConfirm();
    } catch (error) {
      console.error('Error during deletion:', error);
    } finally {
      setIsDeleting(false);
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={isDeleting ? undefined : onClose}
      maxWidth="xs"
      fullWidth
      disableEscapeKeyDown={isDeleting} // Prevent closing during deletion
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography variant="body1">{content}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isDeleting}>
          Cancel
        </Button>
        <Button onClick={handleConfirm} color="error" variant="contained" disabled={isDeleting}>
          {isDeleting ? (
            <>
              <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
              Deleting...
            </>
          ) : (
            'Delete'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

DeleteConfirmationModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
};

export default DeleteConfirmationModal;
