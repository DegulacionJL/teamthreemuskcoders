import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { addComment, deleteComment, getComments, updateComment } from 'services/comment.service';
// Ensure this import is present
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField, // Add this import
  Typography,
} from '@mui/material';
import DeleteConfirmationModal from './organisms/DeleteConfirmationModal';
import EditPostModal from './organisms/EditPostModal';
import PostComments from './organisms/PostComments';
import PostHeader from './organisms/PostHeader';

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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [isPostDeleteModalOpen, setIsPostDeleteModalOpen] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState('');
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

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
    onDelete(id);
    setIsDeleteModalOpen(false);
  };

  useEffect(() => {
    async function fetchComments() {
      try {
        const response = await getComments(id);
        setPostComments(response?.data || []);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    }
    fetchComments();
  }, [id]);

  const handleAddComment = async (newComment) => {
    if (!newComment.trim()) return;
    try {
      const addedComment = await addComment(id, newComment);
      setPostComments((prev) => [...prev, addedComment.data]);
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (commentId) {
      await deleteComment(id, commentId);
      setPostComments((prev) => prev.filter((comment) => comment.id !== commentId));
    }
    setCommentToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const handleUpdateComment = async (commentId, newText) => {
    if (!newText.trim()) return;
    try {
      const response = await updateComment(id, commentId, newText);
      const updatedComment = response.data;
      setPostComments((prev) =>
        prev.map((comment) => (comment.id === commentId ? updatedComment : comment))
      );
      setEditingCommentId(null);
      setEditingCommentText('');
      setIsUpdateModalOpen(false);
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
      <PostHeader
        user={user}
        timestamp={timestamp}
        onMenuOpen={onMenuOpen}
        menuAnchor={menuAnchor}
        isMenuOpen={isMenuOpen}
        onMenuClose={onMenuClose}
        onEdit={() => setIsEditModalOpen(true)}
        onDelete={() => setIsPostDeleteModalOpen(true)}
      />

      <Typography variant="body1" sx={{ mb: 2 }}>
        {currentCaption}
      </Typography>
      {currentImage && (
        <img src={currentImage} alt="Meme" style={{ maxWidth: '100%', borderRadius: '8px' }} />
      )}

      <PostComments
        comments={postComments}
        onAddComment={handleAddComment}
        onEditComment={(commentId, newText) => {
          setEditingCommentId(commentId);
          setEditingCommentText(newText);
          setIsUpdateModalOpen(true);
        }}
        onDeleteComment={(commentId) => {
          setCommentToDelete(commentId);
          setIsDeleteModalOpen(true);
        }}
      />

      <Dialog open={isUpdateModalOpen} onClose={() => setIsUpdateModalOpen(false)}>
        <DialogTitle>Edit Comment</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            size="small"
            value={editingCommentText}
            onChange={(e) => setEditingCommentText(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsUpdateModalOpen(false)}>Cancel</Button>
          <Button
            onClick={() => handleUpdateComment(editingCommentId, editingCommentText)}
            color="primary"
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      <DeleteConfirmationModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => handleDeleteComment(commentToDelete)}
        message="Are you sure you want to delete this comment? This action cannot be undone."
      />

      <DeleteConfirmationModal
        open={isPostDeleteModalOpen}
        onClose={() => setIsPostDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        message="Are you sure you want to delete this POST? This action cannot be undone."
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
