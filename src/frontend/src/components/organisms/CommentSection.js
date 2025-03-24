// CommentSection.js
import PropTypes from 'prop-types';
import React from 'react';
import { Box, Typography } from '@mui/material';
// Remove TextField from import
import CommentInputForm from '../molecules/CommentInputForm';
import CommentsList from './CommentsList';

const CommentSection = ({
  comments, // Remove postId since it's not being used
  onAddComment,
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
    <Box sx={{ mt: 3 }}>
      <Typography variant="subtitle1">Comments</Typography>
      <CommentInputForm onSubmit={(text, image) => onAddComment(text, image)} />
      <CommentsList
        comments={comments}
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
    </Box>
  );
};

CommentSection.propTypes = {
  comments: PropTypes.array.isRequired, // Remove postId from PropTypes
  onAddComment: PropTypes.func.isRequired,
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

export default CommentSection;
