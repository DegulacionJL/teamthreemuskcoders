'use client';

import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { addComment, deleteComment, getComments, updateComment } from 'services/meme.service';
import { ChatBubbleOutline, FavoriteBorder, Send, Share } from '@mui/icons-material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { useTheme as useCustomTheme } from '../theme/ThemeContext';
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
  darkMode,
}) {
  const theme = useTheme(); // MUI theme
  const { darkMode: contextDarkMode } = useCustomTheme(); // Our custom theme context
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
  const [showComments, setShowComments] = useState(false);

  // Use the darkMode prop if provided, otherwise use the context value
  const isDarkMode = darkMode !== undefined ? darkMode : contextDarkMode;

  const handleSave = async (newCaption, newImage) => {
    try {
      const updatedPost = await onUpdate(id, newCaption, newImage);
      if (updatedPost && updatedPost.image) {
        setCurrentImage(updatedPost.image);
      }
      setCurrentCaption(newCaption);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const handleConfirmDelete = () => {
    onDelete(id); // Call delete function
    setIsPostDeleteModalOpen(false);
  };

  // Fetch comments on component mount
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

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      const addedComment = await addComment(id, newComment);
      setPostComments((prev) => [...prev, addedComment.data]);
      setNewComment('');
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
    if (!editingCommentText.trim()) return;
    try {
      const response = await updateComment(id, editingCommentId, editingCommentText);
      const updatedComment = response.data;
      setPostComments((prev) =>
        prev.map((comment) => (comment.id === editingCommentId ? updatedComment : comment))
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
    <Card
      sx={{
        mb: 3,
        borderRadius: 3,
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
        transition: 'background-color 0.3s, color 0.3s',
      }}
    >
      <CardHeader
        avatar={
          <Avatar
            src={user?.avatar || ''}
            alt={`${user?.first_name} ${user?.last_name}`}
            sx={{
              bgcolor: theme.palette.mode === 'dark' ? '#4a3b6b' : theme.palette.primary.light,
            }}
          >
            {user ? `${user.first_name?.charAt(0) || ''}${user.last_name?.charAt(0) || ''}` : 'U'}
          </Avatar>
        }
        action={
          <IconButton onClick={(event) => onMenuOpen(event, id)}>
            <MoreVertIcon />
          </IconButton>
        }
        title={
          <Typography variant="subtitle1" fontWeight="medium">
            {user ? `${user.first_name} ${user.last_name}` : 'Unknown User'}
          </Typography>
        }
        subheader={
          <Typography variant="caption" color="text.secondary">
            {getRelativeTime(timestamp)}
          </Typography>
        }
      />

      <Menu anchorEl={menuAnchor} open={isMenuOpen} onClose={onMenuClose}>
        <MenuItem onClick={() => setIsEditModalOpen(true)}>Edit</MenuItem>
        <MenuItem onClick={() => setIsPostDeleteModalOpen(true)} sx={{ color: 'red' }}>
          Delete
        </MenuItem>
      </Menu>

      <CardContent sx={{ pt: 0, pb: 1 }}>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {currentCaption}
        </Typography>
      </CardContent>

      {currentImage && (
        <CardMedia
          component="img"
          image={currentImage}
          alt="Meme"
          sx={{
            maxHeight: 500,
            objectFit: 'contain',
            bgcolor: isDarkMode ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.03)',
          }}
        />
      )}

      <CardActions disableSpacing>
        <Button
          startIcon={<FavoriteBorder />}
          size="small"
          sx={{ color: theme.palette.text.secondary }}
        >
          245
        </Button>
        <Button
          startIcon={<ChatBubbleOutline />}
          size="small"
          onClick={() => setShowComments(!showComments)}
          sx={{ color: theme.palette.text.secondary }}
        >
          {postComments.length}
        </Button>
        <Button startIcon={<Share />} size="small" sx={{ color: theme.palette.text.secondary }}>
          Share
        </Button>
      </CardActions>

      {showComments && (
        <>
          <Divider />
          <CardContent>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              Comments
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: theme.palette.mode === 'dark' ? '#4a3b6b' : theme.palette.primary.light,
                }}
              >
                {user
                  ? `${user.first_name?.charAt(0) || ''}${user.last_name?.charAt(0) || ''}`
                  : 'U'}
              </Avatar>
              <TextField
                fullWidth
                size="small"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor:
                      theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                    borderRadius: 2,
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        color="primary"
                        onClick={handleAddComment}
                        sx={{ color: '#8a4fff' }}
                      >
                        <Send />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {postComments.length > 0 ? (
              postComments.map((comment) => (
                <Box
                  key={comment.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    mt: 2,
                    pb: 2,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Avatar
                    src={comment.user?.avatar || ''}
                    sx={{
                      mr: 1,
                      width: 32,
                      height: 32,
                      bgcolor:
                        theme.palette.mode === 'dark' ? '#4a3b6b' : theme.palette.primary.light,
                    }}
                    alt={comment.user?.full_name || 'User'}
                  >
                    {getInitials(comment.user?.first_name, comment.user?.last_name)}
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                        {comment.user?.full_name || 'Unknown User'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {comment.timestamp || comment.created_at}
                      </Typography>
                    </Box>

                    {editingCommentId === comment.id ? (
                      <TextField
                        fullWidth
                        size="small"
                        value={editingCommentText}
                        onChange={(e) => setEditingCommentText(e.target.value)}
                        sx={{
                          mt: 1,
                          '& .MuiOutlinedInput-root': {
                            bgcolor:
                              theme.palette.mode === 'dark'
                                ? 'rgba(255,255,255,0.05)'
                                : 'rgba(0,0,0,0.02)',
                            borderRadius: 2,
                          },
                        }}
                      />
                    ) : (
                      <Typography variant="body2" sx={{ mt: 0.5 }}>
                        {comment.text}
                      </Typography>
                    )}
                  </Box>
                  {editingCommentId === comment.id ? (
                    <Button
                      size="small"
                      onClick={() => setIsUpdateModalOpen(true)}
                      sx={{ color: '#8a4fff' }}
                    >
                      Save
                    </Button>
                  ) : (
                    <Box>
                      <IconButton
                        size="small"
                        onClick={() => {
                          setEditingCommentId(comment.id);
                          setEditingCommentText(comment.text);
                          setIsUpdateModalOpen(true);
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
              <Typography
                variant="body2"
                sx={{ color: theme.palette.text.secondary, textAlign: 'center', py: 1 }}
              >
                No comments yet.
              </Typography>
            )}
          </CardContent>
        </>
      )}

      {/* Update Confirmation Modal */}
      <Dialog
        open={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        PaperProps={{
          sx: {
            bgcolor: theme.palette.background.paper,
            borderRadius: 3,
          },
        }}
      >
        <DialogTitle>Edit Comment</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            size="small"
            value={editingCommentText}
            onChange={(e) => setEditingCommentText(e.target.value)}
            sx={{
              mt: 1,
              '& .MuiOutlinedInput-root': {
                bgcolor:
                  theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                borderRadius: 2,
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsUpdateModalOpen(false)}>Cancel</Button>
          <Button
            onClick={handleUpdateComment}
            sx={{
              bgcolor: '#8a4fff',
              color: 'white',
              '&:hover': {
                bgcolor: '#7a3fef',
              },
            }}
          >
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
    </Card>
  );
}

MemePost.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  caption: PropTypes.string.isRequired,
  image: PropTypes.string,
  timestamp: PropTypes.string.isRequired,
  user: PropTypes.object,
  onDelete: PropTypes.func.isRequired,
  onUpdate: PropTypes.func,
  onMenuOpen: PropTypes.func.isRequired,
  onMenuClose: PropTypes.func.isRequired,
  menuAnchor: PropTypes.object,
  isMenuOpen: PropTypes.bool.isRequired,
  darkMode: PropTypes.bool,
};

export default MemePost;
