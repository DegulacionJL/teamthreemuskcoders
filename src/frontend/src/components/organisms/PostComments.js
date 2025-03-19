import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Box, Divider, Typography } from '@mui/material';
import EditCommentModal from 'components/organisms/EditCommentModal';
import CommentInput from '../molecules/CommentInput';
import CommentItem from '../molecules/CommentItem';

function PostComments({ comments, onAddComment, onEditComment, onDeleteComment, currentUser }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingComment, setEditingComment] = useState({
    id: null,
    text: '',
    image: null,
  });

  const handleAddComment = (text, imageBase64) => {
    onAddComment(text, imageBase64);
  };

  const handleEditComment = (commentId, text, image) => {
    setEditingComment({ id: commentId, text, image });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (commentId, text, imageBase64) => {
    onEditComment(commentId, text, imageBase64);
    setIsEditModalOpen(false);
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Divider sx={{ mb: 2 }} />

      <Typography variant="h6" sx={{ mb: 2 }}>
        Comments ({comments.length})
      </Typography>

      <CommentInput onSubmit={handleAddComment} />

      <Box sx={{ mt: 2 }}>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onEdit={handleEditComment}
              onDelete={onDeleteComment}
              currentUser={currentUser}
            />
          ))
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
            No comments yet. Be the first to comment!
          </Typography>
        )}
      </Box>

      <EditCommentModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        commentId={editingComment.id}
        currentText={editingComment.text}
        currentImage={editingComment.image}
        onSave={handleSaveEdit}
      />
    </Box>
  );
}

PostComments.propTypes = {
  comments: PropTypes.array.isRequired,
  onAddComment: PropTypes.func.isRequired,
  onEditComment: PropTypes.func.isRequired,
  onDeleteComment: PropTypes.func.isRequired,
  currentUser: PropTypes.object,
};

export default PostComments;
