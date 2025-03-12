import PropTypes from 'prop-types';
import { Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import CustomButton from '../atoms/Button';

const ConfirmationModal = ({ open, onClose, onConfirm, message }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirm Deletion</DialogTitle>
      <DialogContent>
        <Typography>{message}</Typography>
      </DialogContent>
      <DialogActions>
        <CustomButton label="No" onClick={onClose} color="secondary" />
        <CustomButton label="Yes" onClick={onConfirm} color="error" />
      </DialogActions>
    </Dialog>
  );
};

ConfirmationModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
};

export default ConfirmationModal;
