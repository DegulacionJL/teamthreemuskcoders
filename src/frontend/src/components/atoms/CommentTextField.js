import PropTypes from 'prop-types';
import React from 'react';
import { TextField } from '@mui/material';

function CommentTextField({ value, onChange, placeholder }) {
  return (
    <TextField
      fullWidth
      size="small"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      variant="outlined"
    />
  );
}

CommentTextField.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

export default CommentTextField;
