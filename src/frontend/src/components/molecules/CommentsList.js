import PropTypes from 'prop-types';
import React from 'react';
import { Box, Typography } from '@mui/material';
import CommentItem from 'components/molecules/CommentItem';

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
  onLoadMoreReplies,
  onBackReplies,
  replyHasMore,
  replyPage,
  onReactionChange,
  currentUser,
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
            onLoadMoreReplies={onLoadMoreReplies}
            onBackReplies={onBackReplies}
            replyHasMore={replyHasMore}
            replyPage={replyPage}
            onReactionChange={onReactionChange}
            currentUser={currentUser}
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
  onLoadMoreReplies: PropTypes.func.isRequired,
  onBackReplies: PropTypes.func.isRequired,
  replyHasMore: PropTypes.object.isRequired,
  replyPage: PropTypes.object.isRequired,
  onReactionChange: PropTypes.func.isRequired,
  currentUser: PropTypes.object,
};

export default CommentsList;
