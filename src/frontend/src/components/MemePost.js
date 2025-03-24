import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { addComment, deleteComment, getComments, updateComment } from 'services/comment.service';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CloseIcon from '@mui/icons-material/Close';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import DeleteConfirmationModal from './organisms/DeleteConfirmationModal';
import EditPostModal from './organisms/EditPostModal';

function getRelativeTime(timestamp) {
  const now = new Date();
  const postedTime = new Date(timestamp);
  const diff = Math.floor((now - postedTime) / 1000);

  if (diff < 60) return 'Just now';
  if (diff < 3600) {
    const minutes = Math.floor(diff / 60);
    return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  }
  if (diff < 86400) {
    const hours = Math.floor(diff / 3600);
    return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  }
  const days = Math.floor(diff / 86400);
  return `${days} day${days === 1 ? '' : 's'} ago`;
}

// Helper function to get initials from name
const getInitials = (firstName, lastName) => {
  if (!firstName && !lastName) return 'U';
  return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`;
};

function MemePost({
  id,
  caption,
  image,
  timestamp,
  user,
  onDelete,
  onUpdate,
  onMenuOpen,
  onMenuClose,
  menuAnchor,
  isMenuOpen,
}) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentCaption, setCurrentCaption] = useState(caption);
  const [currentImage, setCurrentImage] = useState(image);
  const [postComments, setPostComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [isPostDeleteModalOpen, setIsPostDeleteModalOpen] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState('');
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [commentImage, setCommentImage] = useState(null);
  const [commentImagePreview, setCommentImagePreview] = useState(null);
  const [updateCommentImagePreview, setUpdateCommentImagePreview] = useState(null);

  // New state variables for reply functionality
  const [replyToComment, setReplyToComment] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [replyImage, setReplyImage] = useState(null);
  const [replyImagePreview, setReplyImagePreview] = useState(null);

  // File input for comment image
  const handleCommentImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCommentImage(file);
      setCommentImagePreview(URL.createObjectURL(file));
    }
  };

  const handleUpdateCommentImage = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCommentImage(file);
      setUpdateCommentImagePreview(URL.createObjectURL(file));
    }
  };

  // New helper function for reply image handling
  const handleReplyImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setReplyImage(file);
      setReplyImagePreview(URL.createObjectURL(file));
    }
  };

  // Function to cancel reply
  const handleCancelReply = () => {
    setReplyToComment(null);
    setReplyText('');
    setReplyImage(null);
    setReplyImagePreview(null);
  };

  const handleSave = async (newCaption, newImage) => {
    try {
      const updatedPost = await onUpdate(id, newCaption, newImage);
      if (updatedPost && updatedPost.image) {
        setCurrentImage(updatedPost.image);
      }
      setCurrentCaption(newCaption);
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const handleConfirmDelete = () => {
    onDelete(id); // Call delete function
    setIsDeleteModalOpen(false);
  };

  const fetchComments = async () => {
    try {
      const response = await getComments(id);
      console.log('Fetched comments:', response.data);
      setPostComments(response.data || []);
      setReplyToComment(null);
      setReplyText('');
    } catch (error) {
      console.error('Error fetching comments:', error);
      setPostComments([]);
    }
  };

  // Fetch comments on component mount
  useEffect(
    () => {
      fetchComments();
    },
    [id]
    // [postComments]
  );

  // Updated handleAddReply function
  const handleAddReply = async (parentId) => {
    if (!replyText.trim() && !replyImage) return;
    try {
      const addedComment = await addComment(id, replyText, replyImage, parentId);

      // Helper function to find and update a comment by ID at any nesting level
      const findAndAddReply = (comments, targetId, newReply) => {
        return comments.map((comment) => {
          // Check if this is the target comment
          if (comment.id === targetId) {
            return {
              ...comment,
              replies: [...(comment.replies || []), newReply],
            };
          }

          // If this comment has replies, search through them too
          if (comment.replies && comment.replies.length > 0) {
            return {
              ...comment,
              replies: findAndAddReply(comment.replies, targetId, newReply),
            };
          }

          return comment;
        });
      };

      // Update state using the helper function
      setPostComments((prevComments) => findAndAddReply(prevComments, parentId, addedComment.data));

      // Reset reply state
      setReplyText('');
      setReplyImage(null);
      setReplyImagePreview(null);
      setReplyToComment(null);
    } catch (error) {
      console.error('Error adding reply:', error);
      // On error, refresh all comments to ensure state is consistent
      fetchComments();
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() && !commentImage) return;
    try {
      const addedComment = await addComment(id, newComment, commentImage);
      setPostComments((prev) => [...prev, addedComment.data]);
      setNewComment('');
      setCommentImage(null);
      setCommentImagePreview(null);
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const confirmDeleteComment = (commentId) => {
    setCommentToDelete(commentId);
    setIsDeleteModalOpen(true);
  };

  // Updated handleDeleteComment function
  const handleDeleteComment = async () => {
    if (commentToDelete) {
      try {
        // Make the API call to delete the comment
        await deleteComment(id, commentToDelete);

        // Helper function to recursively filter out the deleted comment
        const filterDeletedComment = (comments) => {
          // First filter at the current level
          return comments
            .filter((comment) => comment.id !== commentToDelete)
            .map((comment) => {
              // If this comment has replies, filter them too
              if (comment.replies && comment.replies.length > 0) {
                return {
                  ...comment,
                  replies: filterDeletedComment(comment.replies),
                };
              }
              return comment;
            });
        };

        // Update state using the recursive filter function
        setPostComments((prevComments) => filterDeletedComment(prevComments));
      } catch (error) {
        console.error('Error deleting comment:', error);
        // Optionally refresh comments from the server if the delete fails
        fetchComments();
      }

      setCommentToDelete(null);
      setIsDeleteModalOpen(false);
    }
  };

  // Updated handleUpdateComment function
  const handleUpdateComment = async () => {
    if (!editingCommentText.trim() && !commentImage && !updateCommentImagePreview) return;

    try {
      const formData = new FormData();
      formData.append('text', editingCommentText || '');

      // Handle image updates
      if (commentImage) {
        formData.append('image', commentImage); // New image
      } else if (!updateCommentImagePreview) {
        formData.append('remove_image', 'true'); // Remove existing image
      }

      formData.append('_method', 'PUT'); // For Laravel's PUT method handling

      await updateComment(id, editingCommentId, formData);

      // Create a new image URL if there's a new image
      const newImageUrl = commentImage
        ? URL.createObjectURL(commentImage)
        : updateCommentImagePreview;

      // Updated recursive function to update comments at any nesting level
      const updateCommentRecursively = (comments, targetId) => {
        return comments.map((comment) => {
          // If this is the comment we're editing
          if (comment.id === targetId) {
            return {
              ...comment,
              text: editingCommentText,
              image: newImageUrl,
            };
          }

          // If this comment has replies, check them too
          if (comment.replies && comment.replies.length > 0) {
            const updatedReplies = updateCommentRecursively(comment.replies, targetId);
            // Only create a new object if something changed
            if (updatedReplies !== comment.replies) {
              return {
                ...comment,
                replies: updatedReplies,
              };
            }
          }

          // Return unchanged if not the target and no replies were updated
          return comment;
        });
      };

      // Update state with immutable pattern to ensure React detects the changes
      setPostComments((prevComments) => updateCommentRecursively(prevComments, editingCommentId));

      // Reset states
      setEditingCommentId(null);
      setEditingCommentText('');
      setIsUpdateModalOpen(false);
      setCommentImage(null);
      setCommentImagePreview(null);
      setUpdateCommentImagePreview(null);

      // Optionally fetch fresh comments from the server to ensure consistency
      // fetchComments();
    } catch (error) {
      console.error('Error updating comment:', error);
      alert('Failed to update comment. Please try again.');
      // On error, refresh all comments to ensure state is consistent
      fetchComments();
    }
  };

  // Recursive function to render comments and their replies
  const renderComment = (comment, depth = 0) => (
    <Box
      key={comment.id}
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        mt: 2,
        pb: 2,
        borderBottom: '1px solid #eee',
        ml: depth * 3, // Indent nested comments
      }}
    >
      <Avatar
        src={comment.user?.avatar || ''}
        sx={{ mr: 1 }}
        alt={comment.user?.full_name || 'User'}
      >
        {getInitials(comment.user?.first_name, comment.user?.last_name)}
      </Avatar>
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
              onChange={(e) => setEditingCommentText(e.target.value)}
              sx={{ mt: 1 }}
            />
            {comment.image && (
              <Box sx={{ mt: 1 }}>
                <img
                  src={comment.image}
                  alt="Comment attachment"
                  style={{ maxHeight: '200px', borderRadius: '4px', maxWidth: '100%' }}
                />
              </Box>
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
                <img
                  src={comment.image}
                  alt="Comment attachment"
                  style={{ maxHeight: '200px', borderRadius: '4px', maxWidth: '100%' }}
                />
              </Box>
            )}
          </>
        )}

        {/* Reply button */}
        {replyToComment !== comment.id && (
          <Button
            size="small"
            sx={{ mt: 1, textTransform: 'none' }}
            onClick={() => setReplyToComment(comment.id)}
          >
            Reply
          </Button>
        )}

        {/* Reply form */}
        {replyToComment === comment.id && (
          <Box sx={{ mt: 2, ml: 2 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Write a reply..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              sx={{ mb: 1 }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id={`reply-image-upload-${comment.id}`}
                type="file"
                onChange={handleReplyImageChange}
              />
              <label htmlFor={`reply-image-upload-${comment.id}`}>
                <IconButton component="span" color="primary" size="small">
                  <AddPhotoAlternateIcon fontSize="small" />
                </IconButton>
              </label>
              <Button variant="contained" size="small" onClick={() => handleAddReply(comment.id)}>
                Reply
              </Button>
              <Button size="small" onClick={handleCancelReply}>
                Cancel
              </Button>
            </Box>
            {replyImagePreview && (
              <Box sx={{ mt: 1, position: 'relative', display: 'inline-block' }}>
                <img
                  src={replyImagePreview}
                  alt="Preview"
                  style={{ maxHeight: '80px', borderRadius: '4px' }}
                />
                <IconButton
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    backgroundColor: 'rgba(255,255,255,0.7)',
                  }}
                  onClick={() => setReplyImagePreview(null)}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            )}
          </Box>
        )}

        {/* Render replies */}
        {comment.replies && comment.replies.length > 0 && (
          <Box sx={{ mt: 2 }}>
            {comment.replies.map((reply) => renderComment(reply, depth + 1))}
          </Box>
        )}
      </Box>
      <Box>
        <IconButton
          size="small"
          onClick={() => {
            setEditingCommentId(comment.id);
            setEditingCommentText(comment.text);
            setIsUpdateModalOpen(true);
            setUpdateCommentImagePreview(comment.image);
          }}
        >
          ✏️
        </IconButton>
        <IconButton size="small" onClick={() => confirmDeleteComment(comment.id)}>
          🗑️
        </IconButton>
      </Box>
    </Box>
  );

  return (
    <Box
      sx={{
        p: 2,
        backgroundColor: 'white',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
        width: '550px',
        minHeight: '250px',
        maxWidth: '100%',
        margin: 'auto',
        mt: 4,
      }}
    >
      <>
        {/* Post Header with Menu */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar
                src={user?.avatar || ''}
                sx={{ mr: 2 }}
                alt={`${user?.first_name} ${user?.last_name}`}
              >
                {user
                  ? `${user.first_name?.charAt(0) || ''}${user.last_name?.charAt(0) || ''}`
                  : 'U'}
              </Avatar>
              <Typography variant="h6">
                {user ? `${user.first_name} ${user.last_name}` : 'Unknown User'}
              </Typography>
            </Box>
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: 'gray' }}>
              {getRelativeTime(timestamp)}
            </Typography>
            <IconButton onClick={(event) => onMenuOpen(event, id)}>
              <MoreVertIcon />
            </IconButton>
          </Box>
          <Menu anchorEl={menuAnchor} open={isMenuOpen} onClose={onMenuClose}>
            <MenuItem onClick={() => setIsEditModalOpen(true)}>Edit</MenuItem>
            <MenuItem onClick={() => setIsPostDeleteModalOpen(true)} sx={{ color: 'red' }}>
              Delete
            </MenuItem>
          </Menu>
        </Box>

        <DeleteConfirmationModal
          open={isPostDeleteModalOpen}
          onClose={() => setIsPostDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          message="Are you sure you want to delete this POST? This action cannot be undone."
        />
      </>

      <Typography variant="body1" sx={{ mb: 2 }}>
        {currentCaption}
      </Typography>
      {currentImage && (
        <img src={currentImage} alt="Meme" style={{ maxWidth: '100%', borderRadius: '8px' }} />
      )}

      {/* Comment Section */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle1">Comments</Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, gap: 1 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="comment-image-upload"
            type="file"
            onChange={handleCommentImageChange}
          />
          <label htmlFor="comment-image-upload">
            <IconButton component="span" color="primary">
              <AddPhotoAlternateIcon />
            </IconButton>
          </label>
          <Button variant="contained" onClick={handleAddComment}>
            Comment
          </Button>
        </Box>

        {commentImagePreview && (
          <Box sx={{ mt: 1, position: 'relative', display: 'inline-block' }}>
            <img
              src={commentImagePreview}
              alt="Preview"
              style={{ maxHeight: '100px', borderRadius: '4px' }}
            />
            <IconButton
              size="small"
              sx={{
                position: 'absolute',
                top: 0,
                right: 0,
                backgroundColor: 'rgba(255,255,255,0.7)',
              }}
              onClick={() => setCommentImagePreview(null)}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        )}

        {/* Updated comment rendering section */}
        <Box sx={{ mt: 2 }}>
          {postComments.length > 0 ? (
            postComments.map((comment) => renderComment(comment))
          ) : (
            <Typography variant="body2" sx={{ color: 'gray', mt: 1 }}>
              No comments yet.
            </Typography>
          )}
        </Box>
      </Box>

      {/* Update Confirmation Modal */}
      <Dialog open={isUpdateModalOpen} onClose={() => setIsUpdateModalOpen(false)}>
        <DialogTitle>Edit Comment</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            size="small"
            value={editingCommentText}
            onChange={(e) => setEditingCommentText(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="edit-comment-image"
              type="file"
              src={commentImagePreview}
              onChange={handleUpdateCommentImage}
            />
            <label htmlFor="edit-comment-image">
              <Button component="span" variant="outlined" startIcon={<AddPhotoAlternateIcon />}>
                {updateCommentImagePreview ? 'Change Image' : 'Add Image'}
              </Button>
            </label>
            {updateCommentImagePreview && (
              <IconButton
                onClick={() => {
                  setUpdateCommentImagePreview(null);
                }}
              >
                <CloseIcon />
              </IconButton>
            )}
          </Box>
          {updateCommentImagePreview && (
            <Box sx={{ mt: 2 }}>
              <img
                src={updateCommentImagePreview}
                alt="Preview"
                style={{ maxHeight: '150px', borderRadius: '4px' }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsUpdateModalOpen(false)}>Cancel</Button>
          <Button onClick={handleUpdateComment} color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      <DeleteConfirmationModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteComment}
        message="Are you sure you want to delete this comment? This action cannot be undone."
      />

      <EditPostModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        currentCaption={currentCaption}
        currentImage={currentImage}
        onSave={handleSave}
      />
    </Box>
  );
}

MemePost.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  caption: PropTypes.string.isRequired,
  image: PropTypes.string,
  timestamp: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired,
  onDelete: PropTypes.func.isRequired,
  onUpdate: PropTypes.func,
  onMenuOpen: PropTypes.func.isRequired,
  onMenuClose: PropTypes.func.isRequired,
  menuAnchor: PropTypes.object,
  isMenuOpen: PropTypes.bool.isRequired,
};

export default MemePost;
