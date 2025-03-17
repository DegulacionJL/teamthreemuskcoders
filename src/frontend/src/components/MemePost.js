import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { addComment, deleteComment, getComments } from 'services/meme.service';
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

function MemePost({
  id,
  caption,
  image,
  timestamp,
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

  const handleSave = async (newCaption, newImage) => {
    setCurrentCaption(newCaption);
    setCurrentImage(newImage);
    onUpdate(id, newCaption, newImage);
  };
  const handleConfirmDelete = () => {
    onDelete(id); // Call delete function
    setIsDeleteModalOpen(false);
  };

  // Fetch comments on component mount
  useEffect(() => {
    async function fetchComments() {
      const response = await getComments(id);
      console.log('Fetched comments:', response); // Debugging

      if (response?.data) {
        setPostComments(response.data);
      } else {
        setPostComments([]);
      }
    }
    fetchComments();
  }, [id]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    const addedComment = await addComment(id, newComment);
    setPostComments((prev) => [...prev, addedComment.data]); // Ensure correct structure
    setNewComment(''); // Reset input
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

  return (
    <Box
      sx={{
        p: 2,
        backgroundColor: 'white',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
        border: '2px solid',
        borderColor: 'red',
        maxWidth: '500px',
        margin: 'auto',
        mt: 4,
      }}
    >
      <>
        {/* Post Header with Menu */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ mr: 2 }}>U</Avatar>
            <Typography variant="h6">User</Typography>
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
          <Button variant="contained" onClick={handleAddComment}>
            Comment
          </Button>
        </Box>

        <Box sx={{ mt: 2 }}>
          {postComments.length > 0 ? (
            postComments.map((comment) => (
              <Box key={comment.id} sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <Avatar sx={{ mr: 1 }}>C</Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="body2">{comment.text}</Typography>
                  <Typography variant="caption" color="gray">
                    {getRelativeTime(comment.timestamp)}
                  </Typography>
                </Box>
                <IconButton size="small" onClick={() => confirmDeleteComment(comment.id)}>
                  🗑️
                </IconButton>
              </Box>
            ))
          ) : (
            <Typography variant="body2" sx={{ color: 'gray', mt: 1 }}>
              No comments yet.
            </Typography>
          )}
        </Box>
      </Box>

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
  onDelete: PropTypes.func.isRequired,
  onUpdate: PropTypes.func,
  onMenuOpen: PropTypes.func.isRequired,
  onMenuClose: PropTypes.func.isRequired,
  menuAnchor: PropTypes.object,
  isMenuOpen: PropTypes.bool.isRequired,
};

export default MemePost;
