import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Avatar, Box, Button, TextField, Typography } from '@mui/material';
import ImagePreview from '../atoms/ImagePreview';
import ImageUploadButton from '../molecules/ImageUploadButton';
import CommentsList from './CommentsList';

function CommentSection({
  comments,
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
}) {
  const [newCommentText, setNewCommentText] = useState('');
  const [newCommentImage, setNewCommentImage] = useState(null);
  const [newCommentImagePreview, setNewCommentImagePreview] = useState(null);

  const handleAddComment = () => {
    if (!newCommentText.trim() && !newCommentImage) return;
    onAddComment(newCommentText, newCommentImage);
    setNewCommentText('');
    setNewCommentImage(null);
    setNewCommentImagePreview(null);
  };

  const handleImageUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewCommentImage(file);
      setNewCommentImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <Box sx={{ mt: 2, px: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Avatar sx={{ mr: 1 }}>U</Avatar>
        <Box sx={{ flexGrow: 1 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Add a comment..."
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            sx={{ mb: 1 }}
          />
          {newCommentImagePreview && (
            <ImagePreview
              src={newCommentImagePreview}
              onRemove={() => {
                setNewCommentImage(null);
                setNewCommentImagePreview(null);
              }}
              maxHeight="100px"
            />
          )}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <ImageUploadButton
              onChange={handleImageUpload}
              id="new-comment-image"
              buttonVariant="text"
              buttonText="Add Image"
            />
            <Button variant="contained" onClick={handleAddComment}>
              Post
            </Button>
          </Box>
        </Box>
      </Box>

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
}

CommentSection.propTypes = {
  comments: PropTypes.array.isRequired,
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
