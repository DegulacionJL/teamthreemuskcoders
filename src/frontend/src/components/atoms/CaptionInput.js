import PropTypes from 'prop-types';
import React from 'react';
import { TextField } from '@mui/material';

function CaptionInput({ value, onChange }) {
  return (
    <TextField
      label="Caption"
      value={value}
      onChange={onChange}
      variant="outlined"
      fullWidth
      multiline
      rows={4}
    />
  );
}

// Define prop types
CaptionInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default CaptionInput;
