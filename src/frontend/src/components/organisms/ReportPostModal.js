'use client';

import PropTypes from 'prop-types';
import { useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  Typography,
} from '@mui/material';

const REPORT_REASONS = [
  'Offensive content',
  'Spam or misleading',
  'Harassment or bullying',
  'Violent or dangerous',
  'Sexually explicit or inappropriate content',
  'Misinformation or fake news',
];

const ReportPostConfirmationModal = ({ open, onClose, onConfirm, title, content }) => {
  const [isReporting, setIsReporting] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);
  const [selectedReason, setSelectedReason] = useState('');

  const handleConfirm = async () => {
    try {
      setIsReporting(true);
      await onConfirm(selectedReason);
      setReportSuccess(true);
      setTimeout(() => {
        onClose();
        setReportSuccess(false);
        setSelectedReason('');
      }, 1500);
    } catch (error) {
      console.error('Error during reporting post: ', error);
    } finally {
      setIsReporting(false);
    }
  };

  const handleCheckboxChange = (reason) => {
    setSelectedReason(reason === selectedReason ? '' : reason);
  };

  return (
    <Dialog
      open={open}
      onClose={isReporting ? undefined : onClose}
      maxWidth="xs"
      fullWidth
      disableEscapeKeyDown={isReporting}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography variant="body1" mb={2}>
          {content}
        </Typography>

        {!reportSuccess && (
          <Box sx={{ maxHeight: 200, overflowY: 'auto', px: 1 }}>
            <FormGroup>
              {REPORT_REASONS.map((reason) => (
                <FormControlLabel
                  key={reason}
                  control={
                    <Checkbox
                      checked={selectedReason === reason}
                      onChange={() => handleCheckboxChange(reason)}
                      sx={{ color: 'white' }}
                    />
                  }
                  label={reason}
                  sx={{ color: 'white' }}
                />
              ))}
            </FormGroup>
          </Box>
        )}

        {reportSuccess && (
          <Typography color="success.main" mt={2}>
            ✅ Report submitted successfully!
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isReporting || reportSuccess}>
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          color="error"
          variant="contained"
          disabled={isReporting || reportSuccess || !selectedReason}
        >
          {isReporting ? (
            <>
              <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
              Reporting...
            </>
          ) : reportSuccess ? (
            'Reported'
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
