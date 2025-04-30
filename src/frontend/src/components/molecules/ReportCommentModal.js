import PropTypes from 'prop-types';
import React from 'react';
import { toast } from 'react-toastify';
import * as commentService from 'services/comment.service';
import CloseIcon from '@mui/icons-material/Close';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';

const ReportCommentModal = ({ open, onClose, postId, commentId }) => {
  const [reportReason, setReportReason] = React.useState('');
  const [reportError, setReportError] = React.useState(null);
  const [isReporting, setIsReporting] = React.useState(false);

  const handleReportSubmit = async () => {
    if (!reportReason.trim()) {
      setReportError('Please provide a reason for reporting.');
      return;
    }

    setIsReporting(true);
    setReportError(null);

    try {
      await commentService.reportComment(postId, commentId, reportReason);
      onClose();
      toast.success('Report submitted successfully.');
    } catch (error) {
      if (error.response?.data?.error === 'You have already reported this comment.') {
        setReportError('You have already reported this comment.');
        toast.info('You have already reported this comment.');
      } else {
        setReportError('Failed to submit report. Please try again.');
        toast.error('Failed to submit report. Please try again.');
      }
    } finally {
      setIsReporting(false);
    }
  };

  const handleCancel = () => {
    onClose();
    setReportReason('');
    setReportError(null);
  };

  return (
    <Dialog open={open} onClose={handleCancel} maxWidth="sm" fullWidth>
      <DialogTitle>
        Report Comment
        <IconButton
          aria-label="close"
          onClick={handleCancel}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Are you sure you want to report this comment? Please provide a reason.
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          value={reportReason}
          onChange={(e) => setReportReason(e.target.value)}
          placeholder="Enter your reason for reporting..."
          error={!!reportError}
          helperText={reportError}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} disabled={isReporting}>
          Cancel
        </Button>
        <Button
          onClick={handleReportSubmit}
          variant="contained"
          color="warning"
          disabled={isReporting}
        >
          {isReporting ? (
            <>
              <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
              Reporting...
            </>
          ) : (
            'Report'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ReportCommentModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  postId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  commentId: PropTypes.number,
};

export default ReportCommentModal;
