import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { addReplyComment, deleteComment, updateComment } from 'services/meme.service';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {
  Avatar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import TimeDisplay from 'components/atoms/TimeDisplay';
import DeleteConfirmationModal from './organisms/DeleteConfirmationModal';

function Comment({ comment, postId, onCommentUpdate, onCommentDelete, currentUserId }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text);
  const [editImage, setEditImage] = useState(null);
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [replyImage, setReplyImage] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const isMenuOpen = Boolean(anchorEl);
  const isCommentOwner = currentUserId === comment.user?.id;

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditClick = () => {
    setIsEditing(true);
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
    handleMenuClose();
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteComment(postId, comment.id);
      onCommentDelete(comment.id);
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
    setIsDeleteModalOpen(false);
  };

  const handleReplyClick = () => {
    setIsReplying(true);
  };

  const handleCancelReply = () => {
    setIsReplying(false);
    setReplyText('');
    setReplyImage(null);
  };

  const handleSubmitReply = async () => {
    if (!replyText.trim() && !replyImage) return;

    try {
      const response = await addReplyComment(postId, comment.id, replyText, replyImage);
      // Make sure we're passing the response data correctly
      onCommentUpdate(response.data || response);
      setIsReplying(false);
      setReplyText('');
      setReplyImage(null);
    } catch (error) {
      console.error('Error adding reply:', error);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditText(comment.text);
    setEditImage(null);
  };

  const handleSubmitEdit = async () => {
    try {
      // Check what values we're sending
      console.log('Submitting edit with text:', editText);
      console.log('Submitting edit with image:', editImage);

      // Always provide at least an empty string for text
      const updatedCommentData = await updateComment(postId, comment.id, editText || '', editImage);

      // Log the response to see what we're getting back
      console.log('Updated comment response:', updatedCommentData);

      onCommentUpdate(updatedCommentData.data || updatedCommentData, true);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating comment:', error);
      setErrorMessage('Failed to update comment. Please try again.');
    }
  };
  const handleReplyImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setReplyImage(file);
    }
  };

  const handleEditImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setEditImage(file);
    }
  };

  return (
    <Box sx={{ mt: 2, borderLeft: '2px solid #eee', pl: 2 }}>
      {/* Comment Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar
            src={comment.user?.avatar || ''}
            sx={{ width: 32, height: 32, mr: 1 }}
            alt={comment.user?.full_name || 'User'}
          >
            {comment.user?.full_name?.charAt(0) || 'U'}
          </Avatar>
          <Typography variant="subtitle2">{comment.user?.full_name || 'Unknown User'}</Typography>
          <Typography variant="caption" sx={{ ml: 1, color: 'gray' }}>
            • {comment.timestamp}
          </Typography>
        </Box>

        {isCommentOwner && (
          <>
            <IconButton size="small" onClick={handleMenuOpen}>
              <MoreVertIcon fontSize="small" />
            </IconButton>
            <Menu anchorEl={anchorEl} open={isMenuOpen} onClose={handleMenuClose}>
              <MenuItem onClick={handleEditClick}>Edit</MenuItem>
              <MenuItem onClick={handleDeleteClick} sx={{ color: 'red' }}>
                Delete
              </MenuItem>
            </Menu>
          </>
        )}
      </Box>

      {/* Comment Content */}
      {isEditing ? (
        <Box sx={{ mt: 1 }}>
          <TextField
            fullWidth
            multiline
            size="small"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
            <Button variant="contained" component="label" size="small">
              Change Image
              <input type="file" hidden accept="image/*" onChange={handleEditImageChange} />
            </Button>
            {editImage && (
              <Typography variant="caption">{editImage.name || 'Image selected'}</Typography>
            )}
            <Box sx={{ ml: 'auto' }}>
              <Button size="small" onClick={handleCancelEdit} sx={{ mr: 1 }}>
                Cancel
              </Button>
              <Button variant="contained" size="small" onClick={handleSubmitEdit}>
                Save
              </Button>
            </Box>
          </Box>
        </Box>
      ) : (
        <>
          <Typography variant="body2" sx={{ mt: 0.5, whiteSpace: 'pre-wrap' }}>
            {comment.text}
          </Typography>
          {comment.image_url && (
            <Box sx={{ mt: 1, mb: 1, maxWidth: '200px' }}>
              <img
                src={comment.image_url}
                alt="Comment attachment"
                style={{ maxWidth: '100%', borderRadius: '4px' }}
              />
            </Box>
          )}
        </>
      )}

      {/* Reply Button */}
      {!isEditing && (
        <Button size="small" onClick={handleReplyClick} sx={{ mt: 0.5, mb: 1 }}>
          Reply
        </Button>
      )}

      {/* Reply Form */}
      {isReplying && (
        <Box sx={{ mt: 1, mb: 2 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Write your reply..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
            <Button variant="contained" component="label" size="small">
              Add Image
              <input type="file" hidden accept="image/*" onChange={handleReplyImageChange} />
            </Button>
            {replyImage && (
              <Typography variant="caption">{replyImage.name || 'Image selected'}</Typography>
            )}
            <Box sx={{ ml: 'auto' }}>
              <Button size="small" onClick={handleCancelReply} sx={{ mr: 1 }}>
                Cancel
              </Button>
              <Button variant="contained" size="small" onClick={handleSubmitReply}>
                Reply
              </Button>
            </Box>
          </Box>
        </Box>
      )}

      {/* Nested Comments */}
      {comment.replies && comment.replies.length > 0 && (
        <Box sx={{ pl: 2, borderLeft: '1px solid #eee' }}>
          {comment.replies.map((reply) => (
            <Comment
              key={reply.id}
              comment={reply}
              postId={postId}
              onCommentUpdate={onCommentUpdate}
              onCommentDelete={onCommentDelete}
              currentUserId={currentUserId}
            />
          ))}
        </Box>
      )}

      <DeleteConfirmationModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        message="Are you sure you want to delete this comment? This action cannot be undone."
      />
    </Box>
  );
}

Comment.propTypes = {
  comment: PropTypes.object.isRequired,
  postId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onCommentUpdate: PropTypes.func.isRequired,
  onCommentDelete: PropTypes.func.isRequired,
  currentUserId: PropTypes.number,
};

export default Comment;
