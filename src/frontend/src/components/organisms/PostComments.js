import PropTypes from 'prop-types';
import React from 'react';
import { Box, Typography } from '@mui/material';
import CommentInput from '../molecules/CommentInput';
import CommentItem from '../molecules/CommentItem';

const PostComments = ({ comments, onAddComment, onEditComment, onDeleteComment }) => {
  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="subtitle1">Comments</Typography>
      <CommentInput onAddComment={onAddComment} />
      <Box sx={{ mt: 2 }}>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onEditComment={onEditComment}
              onDeleteComment={onDeleteComment}
            />
          ))
        ) : (
          <Typography variant="body2" sx={{ color: 'gray', mt: 1 }}>
            No comments yet.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

PostComments.propTypes = {
  comments: PropTypes.array.isRequired,
  onAddComment: PropTypes.func.isRequired,
  onEditComment: PropTypes.func.isRequired,
  onDeleteComment: PropTypes.func.isRequired,
};

export default PostComments;
