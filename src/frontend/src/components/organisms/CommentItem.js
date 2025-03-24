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
  maxDepth = Infinity, // Changed to Infinity to allow unlimited nesting
}) => {
  // No need for maxDepth check if we're allowing unlimited nesting
  const isMaxDepthReached = false;

  return (
    <Box
      key={comment.id}
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        mt: 2,
        pb: 2,
        borderBottom: '1px solid #eee',
        ml: Math.min(depth * 2, 12), // Keep indentation modest
        width: `calc(100% - ${Math.min(depth * 2, 12)}px)`, // Adjust width accordingly
      }}
      data-depth={depth} // Keep for debugging
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

        {/* Reply button - always show it now */}
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

        {/* Reply form */}
        {replyToComment === comment.id && !isMaxDepthReached && (
          <ReplyForm commentId={comment.id} onSubmit={onAddReply} onCancel={onCancelReply} />
        )}

        {/* Render replies - ensure proper alignment */}
        {comment.replies && comment.replies.length > 0 && (
          <Box
            sx={{
              mt: 2,
              pl: 4, // Ensures consistent left padding for all nested replies
              borderLeft: '2px solid #ddd', // Optional: visual separator for nesting
            }}
          >
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
              />
            ))}
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
};

export default CommentItem;
