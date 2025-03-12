import PropTypes from 'prop-types';
import React, { useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import { Avatar, Box, Button, IconButton, TextField, Typography } from '@mui/material';

function CommentSection({ comments, onAddComment, onDeleteComment }) {
  const [newComment, setNewComment] = useState('');

  const handleAddComment = () => {
    if (newComment.trim() === '') return;
    onAddComment(newComment);
    setNewComment('');
  };

  return (
    <Box sx={{ mt: 2 }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Add a comment..."
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        sx={{ mb: 1 }}
      />
      <Button variant="contained" onClick={handleAddComment}>
        Comment
      </Button>

      {comments.map((comment, index) => (
        <Box key={index} sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
          <Avatar sx={{ mr: 1 }}>U</Avatar>
          <Typography variant="body2" sx={{ flexGrow: 1 }}>
            {comment}
          </Typography>
          <IconButton onClick={() => onDeleteComment(index)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      ))}
    </Box>
  );
}

CommentSection.propTypes = {
  comments: PropTypes.arrayOf(PropTypes.string).isRequired,
  onAddComment: PropTypes.func.isRequired,
  onDeleteComment: PropTypes.func.isRequired,
};

export default CommentSection;
