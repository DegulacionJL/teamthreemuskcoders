'use client';

import PropTypes from 'prop-types';
import { useState } from 'react';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';

const ReportPostConfirmationModal = ({ open, onClose, onConfirm, title, content }) => {
  const [isReportPost, setIsReportPost] = useState(false);

  const handleConfirm = async () => {
    try {
      setIsReportPost(true);
      await onConfirm();
    } catch (error) {
      console.error('Error during reporting post: ', error);
    } finally {
      setIsReportPost(false);
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={isReportPost ? undefined : onClose}
      maxWidth="xs"
      fullWidth
      disableEscapeKeyDown={isReportPost}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography variant="body1">{content}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isReportPost}>
          Cancel
        </Button>
        <Button onClick={handleConfirm} color="error" variant="contained" disabled={isReportPost}>
          {isReportPost ? (
            <>
              <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
              Reporting...
            </>
          ) : (
            'Report Post'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ReportPostConfirmationModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
};

export default ReportPostConfirmationModal;
