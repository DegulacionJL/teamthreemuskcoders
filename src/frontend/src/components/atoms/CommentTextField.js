import React from 'react';
import { TextField } from '@mui/material';

function CommentTextField({ value, onChange }) {
  return (
    <TextField
      fullWidth
      variant="outlined"
      size="small"
      placeholder="Write a comment..."
      value={value}
      onChange={onChange}
    />
  );
}

export default CommentTextField;
