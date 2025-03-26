import PropTypes from 'prop-types';
import React from 'react';
import { Box, Typography } from '@mui/material';
import CommentItem from './CommentItem';

const CommentsList = ({
  comments,
  replyToComment,
  onReplyClick,
  onCancelReply,
  onAddReply,
  onEditClick,
  onDeleteClick,
  editingCommentId,
  editingCommentText,
  onEditingTextChange,
}) => {
  return (
    <Box sx={{ mt: 2, ml: 2 }}>
      {comments.length > 0 ? (
        comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            replyToComment={replyToComment}
            onReplyClick={onReplyClick}
            onCancelReply={onCancelReply}
            onAddReply={onAddReply}
            onEditClick={onEditClick}
            onDeleteClick={onDeleteClick}
            editingCommentId={editingCommentId}
            editingCommentText={editingCommentText}
            onEditingTextChange={onEditingTextChange}
          />
        ))
      ) : (
        <Typography variant="body2" sx={{ color: 'gray', mt: 1 }}>
          No comments yet.
        </Typography>
      )}
    </Box>
  );
};

CommentsList.propTypes = {
  comments: PropTypes.array.isRequired,
  replyToComment: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onReplyClick: PropTypes.func.isRequired,
  onCancelReply: PropTypes.func.isRequired,
  onAddReply: PropTypes.func.isRequired,
  onEditClick: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
  editingCommentId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  editingCommentText: PropTypes.string,
  onEditingTextChange: PropTypes.func.isRequired,
};

export default CommentsList;
