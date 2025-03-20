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
  // const [updateCommentImage, setUpdateCommentImage] = useState(null);

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

  // Clear image selection
  // const clearCommentImage = () => {
  //   setCommentImage(null);
  //   setCommentImagePreview(null);
  // };

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
      console.log('Fetched comments:', response.data); // Debugging
      setPostComments(response.data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
      setPostComments([]); // Prevent undefined issues
    }
  };

  // Fetch comments on component mount
  useEffect(
    () => {
      fetchComments();
    },
    [id],
    [postComments]
  );

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

  const handleDeleteComment = async () => {
    if (commentToDelete) {
      await deleteComment(id, commentToDelete);
      setPostComments((prev) => prev.filter((comment) => comment.id !== commentToDelete));
    }
    setCommentToDelete(null);
    setIsDeleteModalOpen(false);
  };

  // updating comments
  const handleUpdateComment = async () => {
    if (!editingCommentText.trim() && !commentImage) return;

    try {
      const formData = new FormData();
      formData.append('text', editingCommentText || '');

      if (commentImage) {
        // New image uploaded
        formData.append('image', commentImage);
      } else if (updateCommentImagePreview) {
        // Keep existing image (do nothing)
      } else {
        // We want to remove the image - pass a special value
        formData.append('remove_image', 'true');
      }

      formData.append('_method', 'PUT');

      await updateComment(id, editingCommentId, formData);

      await fetchComments();

      setEditingCommentId(null);
      setEditingCommentText('');
      setIsUpdateModalOpen(false);
      setCommentImagePreview(null);
      setUpdateCommentImagePreview(null);
    } catch (error) {
      console.error('Error updating comment:', error);
      alert('Failed to update comment. Please try again.');
    }
  };

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
            // src={postComments.image}
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

        <Box sx={{ mt: 2 }}>
          {postComments.length > 0 ? (
            postComments.map((comment) => (
              <Box
                key={comment.id}
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  mt: 2,
                  pb: 2,
                  borderBottom: '1px solid #eee',
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
                  <Box
                    sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  >
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
                </Box>
                {isUpdateModalOpen === true ? (
                  <Button size="small" onClick={() => setIsUpdateModalOpen(true)}>
                    Save
                  </Button>
                ) : (
                  <Box>
                    <IconButton
                      size="small"
                      onClick={() => {
                        setEditingCommentId(comment.id);
                        setEditingCommentText(comment.text);
                        // setCommentImagePreview(comment.image);
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
                )}
              </Box>
            ))
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
