import PropTypes from 'prop-types';
import React from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import AvatarWithInitials from 'components/atoms/AvatarWithInitial';
import ImagePreview from '../atoms/ImagePreview';
import CommentActions from '../molecules/CommentActions';
import ReplyForm from '../molecules/ReplyForm';

const CommentItem = ({
  comment,
  depth = 0,
  replyToComment,
  onReplyClick,
  onCancelReply,
  onAddReply,
  onEditClick,
  onDeleteClick,
  editingCommentId,
  editingCommentText,
  onEditingTextChange,
  maxDepth = Infinity,
  onLoadMoreReplies,
  onBackReplies,
  replyHasMore = {},
  replyPage = {},
}) => {
  const isMaxDepthReached = depth >= maxDepth;

  const handleLoadMore = () => {
    if (onLoadMoreReplies) onLoadMoreReplies(comment.id);
  };

  const handleBack = () => {
    if (onBackReplies) {
      const currentPage = replyPage[comment.id] || 1;
      if (currentPage > 1) onBackReplies(comment.id);
    }
  };

  // Ensure replyHasMore and replyPage have default values for this comment
  const hasMoreReplies = !!replyHasMore[comment.id]; // Convert to boolean
  const currentReplyPage = replyPage[comment.id] || 1;

  return (
    <Box
      key={comment.id}
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        mt: 2,
        pb: 2,
        borderBottom: '1px solid #eee',
        ml: Math.min(depth * 2, 12),
        width: `calc(100% - ${Math.min(depth * 2, 12)}px)`,
      }}
      data-depth={depth}
    >
      <AvatarWithInitials user={comment.user} sx={{ mr: 1, width: 32, height: 32 }} />
      <Box sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
            {comment.user?.full_name || 'Unknown User'}
          </Typography>
          <Typography variant="caption" color="gray">
            {comment.timestamp || comment.created_at}
          </Typography>
        </Box>

        {editingCommentId === comment.id ? (
          <>
            <TextField
              fullWidth
              size="small"
              value={editingCommentText}
              onChange={(e) => onEditingTextChange(e.target.value)}
              sx={{ mt: 1 }}
            />
            {comment.image && (
              <ImagePreview src={comment.image} maxHeight="200px" showRemoveButton={false} />
            )}
          </>
        ) : (
          <>
            {comment.text && (
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                {comment.text}
              </Typography>
            )}
            {comment.image && (
              <Box sx={{ mt: 1 }}>
                <ImagePreview src={comment.image} maxHeight="200px" showRemoveButton={false} />
              </Box>
            )}
          </>
        )}

        <Box sx={{ mt: 1 }}>
          {replyToComment !== comment.id && !isMaxDepthReached && (
            <Button
              size="small"
              sx={{ mt: 1, textTransform: 'none' }}
              onClick={() => onReplyClick(comment.id)}
            >
              Reply
            </Button>
          )}
        </Box>

        {replyToComment === comment.id && !isMaxDepthReached && (
          <ReplyForm commentId={comment.id} onSubmit={onAddReply} onCancel={onCancelReply} />
        )}

        {comment.replies && comment.replies.length > 0 && (
          <Box sx={{ mt: 2, pl: 4, borderLeft: '2px solid #ddd' }}>
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                depth={depth + 1}
                replyToComment={replyToComment}
                onReplyClick={onReplyClick}
                onCancelReply={onCancelReply}
                onAddReply={onAddReply}
                onEditClick={onEditClick}
                onDeleteClick={onDeleteClick}
                editingCommentId={editingCommentId}
                editingCommentText={editingCommentText}
                onEditingTextChange={onEditingTextChange}
                maxDepth={maxDepth}
                onLoadMoreReplies={onLoadMoreReplies}
                onBackReplies={onBackReplies}
                replyHasMore={replyHasMore}
                replyPage={replyPage}
              />
            ))}
            {(hasMoreReplies || currentReplyPage > 1) && (
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 1 }}>
                {currentReplyPage > 1 && onBackReplies && (
                  <Button onClick={handleBack} disabled={false}>
                    Back
                  </Button>
                )}
                {hasMoreReplies && onLoadMoreReplies && (
                  <Button onClick={handleLoadMore} disabled={false}>
                    Load More
                  </Button>
                )}
              </Box>
            )}
          </Box>
        )}
      </Box>
      <CommentActions
        onEdit={() => onEditClick(comment)}
        onDelete={() => onDeleteClick(comment.id)}
      />
    </Box>
  );
};

CommentItem.propTypes = {
  comment: PropTypes.object.isRequired,
  depth: PropTypes.number,
  replyToComment: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onReplyClick: PropTypes.func.isRequired,
  onCancelReply: PropTypes.func.isRequired,
  onAddReply: PropTypes.func.isRequired,
  onEditClick: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
  editingCommentId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  editingCommentText: PropTypes.string,
  onEditingTextChange: PropTypes.func.isRequired,
  maxDepth: PropTypes.number,
  onLoadMoreReplies: PropTypes.func,
  onBackReplies: PropTypes.func,
  replyHasMore: PropTypes.object,
  replyPage: PropTypes.object,
};

export default CommentItem;
