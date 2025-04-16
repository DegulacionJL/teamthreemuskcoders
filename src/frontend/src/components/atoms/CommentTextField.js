import PropTypes from 'prop-types';
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

CommentTextField.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default CommentTextField;
