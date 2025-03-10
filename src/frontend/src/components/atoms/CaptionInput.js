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

export default CaptionInput;
