import PropTypes from 'prop-types';
import React, { useState } from 'react';
// Add this import
import { Box, Button, TextField } from '@mui/material';

const CommentInput = ({ onAddComment }) => {
  const [newComment, setNewComment] = useState('');

  const handleAddComment = () => {
    onAddComment(newComment);
    setNewComment('');
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, gap: 1 }}>
      <TextField
        fullWidth
        size="small"
        placeholder="Add a comment..."
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
      />
      <Button variant="contained" onClick={handleAddComment}>
        Comment
      </Button>
    </Box>
  );
};

CommentInput.propTypes = {
  onAddComment: PropTypes.func.isRequired, // PropTypes validation
};

export default CommentInput;
