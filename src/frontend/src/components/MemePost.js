import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { addComment, deleteComment, getComments, updateComment } from 'services/meme.service';
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
import Comment from 'components/Comment';
import TimeDisplay from 'components/atoms/TimeDisplay';
import DeleteConfirmationModal from './organisms/DeleteConfirmationModal';
import EditPostModal from './organisms/EditPostModal';

// Import the Comment component

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
  const [commentImage, setCommentImage] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPostDeleteModalOpen, setIsPostDeleteModalOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null); // This should be set from your auth context or similar

  useEffect(() => {
    setCurrentUserId(user?.id);
  }, [user]);

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
    if (!newComment.trim() && !commentImage) return;
    try {
      const addedComment = await addComment(id, newComment, commentImage);
      setPostComments((prev) => [...prev, addedComment.data || addedComment]);
      setNewComment('');
      setCommentImage(null);
      toast.success('Comment added successfully!');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    }
  };

  const handleCommentUpdate = (updatedComment, isEdit = false) => {
    if (isEdit) {
      // Handle editing existing comment
      setPostComments((prev) => {
        // First check if it's a top-level comment
        const updatedComments = prev.map((comment) => {
          if (comment.id === updatedComment.id) {
            return updatedComment;
          }

          // Check if it's a reply within any comment
          if (comment.replies && comment.replies.length > 0) {
            const updatedReplies = comment.replies.map((reply) =>
              reply.id === updatedComment.id ? updatedComment : reply
            );
            return { ...comment, replies: updatedReplies };
          }

          return comment;
        });

        return updatedComments;
      });
    } else {
      // Handle adding a reply to a comment
      setPostComments((prev) => {
        return prev.map((comment) => {
          if (comment.id === updatedComment.parent_id) {
            // Create a new object to ensure React detects the change
            const updatedReplies = comment.replies
              ? [...comment.replies, updatedComment]
              : [updatedComment];
            return { ...comment, replies: updatedReplies };
          }

          // Also check nested replies in case we're replying to a reply
          if (comment.replies && comment.replies.length > 0) {
            let found = false;
            const updatedReplies = comment.replies.map((reply) => {
              if (reply.id === updatedComment.parent_id) {
                found = true;
                const nestedReplies = reply.replies
                  ? [...reply.replies, updatedComment]
                  : [updatedComment];
                return { ...reply, replies: nestedReplies };
              }
              return reply;
            });

            if (found) {
              return { ...comment, replies: updatedReplies };
            }
          }

          return comment;
        });
      });
    }
  };

  const handleCommentDelete = (commentId) => {
    // Recursive function to remove comment from nested structure
    const removeComment = (comments) => {
      return comments.filter((comment) => {
        if (comment.id === commentId) {
          toast.success('Comment deleted successfully!');
          return false;
        }

        // Check for nested replies
        if (comment.replies && comment.replies.length > 0) {
          comment.replies = removeComment(comment.replies);
        }

        return true;
      });
    };

    // Update state with the filtered comments
    setPostComments((prev) => removeComment([...prev])); // Create a new array to ensure React detects the change
  };
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setCommentImage(file);
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
          <Box
            sx={{
              padding: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography variant="caption" sx={{ color: 'gray', position: 'relative', top: '-2px' }}>
              {TimeDisplay({ timestamp })}
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

        <Box sx={{ display: 'flex', flexDirection: 'column', mt: 1, gap: 1 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button variant="contained" component="label" size="small">
              Add Image
              <input type="file" hidden accept="image/*" onChange={handleImageChange} />
            </Button>
            {commentImage && (
              <Typography variant="caption">{commentImage.name || 'Image selected'}</Typography>
            )}
            <Button variant="contained" onClick={handleAddComment} sx={{ ml: 'auto' }}>
              Comment
            </Button>
          </Box>
        </Box>

        <Box sx={{ mt: 2 }}>
          {postComments.length > 0 ? (
            postComments.map((comment) => (
              <Comment
                key={comment.id}
                comment={comment}
                postId={id}
                onCommentUpdate={handleCommentUpdate}
                onCommentDelete={handleCommentDelete}
                currentUserId={currentUserId}
              />
            ))
          ) : (
            <Typography variant="body2" sx={{ color: 'gray', mt: 1 }}>
              No comments yet.
            </Typography>
          )}
        </Box>
      </Box>

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
  user: PropTypes.object.isRequired,
  onUpdate: PropTypes.func,
  onMenuOpen: PropTypes.func.isRequired,
  onMenuClose: PropTypes.func.isRequired,
  menuAnchor: PropTypes.object,
  isMenuOpen: PropTypes.bool.isRequired,
};

export default MemePost;
