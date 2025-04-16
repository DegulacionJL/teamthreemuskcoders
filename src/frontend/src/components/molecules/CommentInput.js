import PropTypes from 'prop-types';
import React from 'react';
import { Box, Button } from '@mui/material';
import CommentTextField from 'components/atoms/CommentTextField';

function CommentInput({ comment, onChange, onSubmit }) {
  return (
    <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
      <CommentTextField value={comment} onChange={onChange} />
      <Button variant="contained" size="small" onClick={onSubmit}>
        Post
      </Button>
    </Box>
  );
}

CommentInput.propTypes = {
  comment: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default CommentInput;
