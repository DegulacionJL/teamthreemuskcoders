import PropTypes from 'prop-types';
import { useCallback, useEffect, useRef, useState } from 'react';
import { addComment, deleteComment, getComments, updateComment } from 'services/comment.service';
import { ChatBubbleOutline, FavoriteBorder, Share } from '@mui/icons-material';
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
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fade,
  IconButton,
  Menu,
  MenuItem,
  Popper,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import AnimatedEmoji from '../components/atoms/animation/AnimatedEmoji';
import { useTheme as useCustomTheme } from '../theme/ThemeContext';
import ImagePreview from './atoms/ImagePreview';
import ImageUploadButton from './molecules/ImageUploadButton';
import CommentSection from './organisms/CommentSection';
import DeleteConfirmationModal from './organisms/DeleteConfirmationModal';
import EditPostModal from './organisms/EditPostModal';

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
  const theme = useTheme();
  const { darkMode: contextDarkMode } = useCustomTheme();

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
  const [commentImage, setCommentImage] = useState(null);
  const [updateCommentImagePreview, setUpdateCommentImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [tempEditingText, setTempEditingText] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [replyToComment, setReplyToComment] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalComments, setTotalComments] = useState(0);
  const [totalCommentsCount, setTotalCommentsCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  const [showReactions, setShowReactions] = useState(false);
  const [hasReacted, setHasReacted] = useState(false);
  const likeButtonRef = useRef(null);

  const isDarkMode = darkMode !== undefined ? darkMode : contextDarkMode;

  const handleReaction = useCallback(() => {
    setHasReacted(true);
    setShowReactions(false);
    console.log('User reacted with 😂 to post:', id);
  }, [id]);

  const handleSave = useCallback(
    async (newCaption, newImage, removeImage = false) => {
      setIsLoading(true);
      try {
        const updatedPost = await onUpdate(id, newCaption, newImage, removeImage);
        if (updatedPost && updatedPost.image) {
          setCurrentImage(updatedPost.image);
        } else if (removeImage) {
          setCurrentImage(null);
        }
        setCurrentCaption(newCaption);
      } catch (error) {
        console.error('Error updating post:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [id, onUpdate]
  );

  const handleConfirmDelete = useCallback(async () => {
    setIsLoading(true);
    try {
      await onDelete(id);
    } catch (error) {
      console.error('Error deleting post:', error);
    } finally {
      setIsLoading(false);
      setIsPostDeleteModalOpen(false);
    }
  }, [id, onDelete]);

  const fetchComments = useCallback(
    async (page = 1, append = false) => {
      setIsLoading(true);
      try {
        const response = await getComments(id, { page, per_page: 5 });
        const processedComments = processCommentsHierarchy(response.data || []);

        if (append) {
          setPostComments((prevComments) => [...prevComments, ...processedComments]);
        } else {
          setPostComments(processedComments);
        }

        setTotalComments(response.pagination.total);
        setTotalCommentsCount(response.pagination.total_with_replies);
        setHasMore(response.pagination.has_more);
        setCurrentPage(page);
      } catch (error) {
        console.error('Error fetching comments:', error);
        if (!append) {
          setPostComments([]);
          setTotalCommentsCount(0);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [id]
  );

  const processCommentsHierarchy = (commentsArray) => {
    const commentsMap = {};
    const rootComments = [];

    commentsArray.forEach((comment) => {
      comment.replies = comment.replies || [];
      commentsMap[comment.id] = comment;
    });

    commentsArray.forEach((comment) => {
      if (comment.parent_id) {
        const parent = commentsMap[comment.parent_id];
        if (parent) {
          if (!parent.parent_id) {
            parent.replies.push(comment);
          } else {
            const grandparent = commentsMap[parent.parent_id];
            if (grandparent) {
              grandparent.replies.push(comment);
            } else {
              rootComments.push(comment);
            }
          }
        } else {
          rootComments.push(comment);
        }
      } else {
        rootComments.push(comment);
      }
    });

    return rootComments;
  };

  useEffect(() => {
    const fetchInitialCommentCount = async () => {
      try {
        const response = await getComments(id, { page: 1, per_page: 1 });
        setTotalCommentsCount(response.pagination.total_with_replies);
      } catch (error) {
        console.error('Error fetching initial comment count:', error);
      }
    };

    fetchInitialCommentCount();
  }, [id]);

  useEffect(() => {
    if (showComments) {
      fetchComments(1);
    }
  }, [showComments, fetchComments]);

  useEffect(() => {
    setCurrentImage(image);
  }, [image]);

  const handleAddReply = useCallback(
    async (parentId, text, image) => {
      if (!text.trim() && !image) return;
      setIsLoading(true);
      try {
        const parentComment = postComments.find((comment) =>
          comment.replies.some((reply) => reply.id === parentId)
        );
        const finalParentId = parentComment ? parentComment.id : parentId;

        await addComment(id, text, image, finalParentId);
        await fetchComments(1);
        setReplyToComment(null);
      } catch (error) {
        console.error('Error adding reply:', error);
        await fetchComments(1);
      } finally {
        setIsLoading(false);
      }
    },
    [id, fetchComments, postComments]
  );

  const handleAddComment = useCallback(
    async (text, image) => {
      if (!text.trim() && !image) return;
      setIsLoading(true);
      try {
        await addComment(id, text, image);
        await fetchComments(1);
      } catch (error) {
        console.error('Error adding comment:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [id, fetchComments]
  );

  const confirmDeleteComment = useCallback((commentId) => {
    setCommentToDelete(commentId);
    setIsDeleteModalOpen(true);
  }, []);

  const handleDeleteComment = useCallback(async () => {
    if (commentToDelete) {
      setIsLoading(true);
      try {
        await deleteComment(id, commentToDelete);
        await fetchComments(1);
      } catch (error) {
        console.error('Error deleting comment:', error);
      } finally {
        setCommentToDelete(null);
        setIsDeleteModalOpen(false);
        setIsLoading(false);
      }
    }
  }, [commentToDelete, id, fetchComments]);

  const handleEditCommentClick = useCallback((comment) => {
    setEditingCommentId(comment.id);
    setEditingCommentText(comment.text || '');
    setTempEditingText(comment.text || '');
    setIsUpdateModalOpen(true);
    setUpdateCommentImagePreview(comment.image || null);
  }, []);

  const handleUpdateCommentImage = useCallback((e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCommentImage(file);
      setUpdateCommentImagePreview(URL.createObjectURL(file));
    }
  }, []);

  const handleUpdateComment = useCallback(async () => {
    if (!tempEditingText.trim() && !commentImage && updateCommentImagePreview === null) return;

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('text', tempEditingText || '');

      if (commentImage) {
        formData.append('image', commentImage);
      } else if (updateCommentImagePreview === null) {
        formData.append('remove_image', true);
      }
      formData.append('_method', 'PUT');

      await updateComment(id, editingCommentId, formData);
      await fetchComments(1);

      setEditingCommentId(null);
      setEditingCommentText('');
      setTempEditingText('');
      setIsUpdateModalOpen(false);
      setCommentImage(null);
      setUpdateCommentImagePreview(null);
    } catch (error) {
      console.error('Error updating comment:', error);
    } finally {
      setIsLoading(false);
    }
  }, [
    tempEditingText,
    commentImage,
    updateCommentImagePreview,
    id,
    editingCommentId,
    fetchComments,
  ]);

  const handleCancelUpdateComment = useCallback(() => {
    setEditingCommentId(null);
    setEditingCommentText('');
    setIsUpdateModalOpen(false);
    setCommentImage(null);
    setUpdateCommentImagePreview(null);
  }, []);

  const handleLoadMore = useCallback(() => {
    fetchComments(currentPage + 1, true);
  }, [fetchComments, currentPage]);

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

  return (
    <Card
      sx={{
        mb: 3,
        borderRadius: 1,
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
        transition: 'background-color 0.3s, color 0.3s',
        maxWidth: '800px',
        width: '100%',
        mx: 'auto',
        position: 'relative',
      }}
    >
      {isLoading && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            zIndex: 10,
          }}
        >
          <CircularProgress />
        </Box>
      )}

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
        <Typography variant="body1" sx={{ mb: 2, mt: 2 }}>
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
        <Box sx={{ position: 'relative' }}>
          <Button
            ref={likeButtonRef}
            startIcon={
              hasReacted ? (
                <Typography sx={{ fontSize: '16px' }}>😂</Typography>
              ) : (
                <FavoriteBorder />
              )
            }
            size="small"
            sx={{ color: theme.palette.text.secondary }}
            onMouseEnter={() => !hasReacted && setShowReactions(true)}
            onMouseLeave={() => setTimeout(() => setShowReactions(false), 300)}
            onClick={() => hasReacted && setHasReacted(false)}
          >
            {hasReacted ? 'Haha' : 'Like'}
          </Button>

          <Popper
            open={showReactions}
            anchorEl={likeButtonRef.current}
            placement="top"
            transition
            disablePortal
          >
            {({ TransitionProps }) => (
              <Fade {...TransitionProps} timeout={350}>
                <Box
                  sx={{
                    position: 'relative',
                    mb: 1,
                    mt: 0.5,
                    '&:after': {
                      content: '""',
                      position: 'absolute',
                      bottom: -8,
                      left: 20,
                      borderWidth: 8,
                      borderStyle: 'solid',
                      borderColor: `${
                        isDarkMode ? 'rgba(40, 40, 40, 0.9)' : 'rgba(245, 245, 245, 0.9)'
                      } transparent transparent transparent`,
                    },
                  }}
                >
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: 2,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      bgcolor: isDarkMode ? 'rgba(40, 40, 40, 0.9)' : 'rgba(245, 245, 245, 0.9)',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                      minWidth: 50,
                      minHeight: 40,
                    }}
                    onMouseEnter={() => setShowReactions(true)}
                    onMouseLeave={() => setShowReactions(false)}
                  >
                    <AnimatedEmoji emoji="😂" size={32} onClick={handleReaction} />
                  </Box>
                </Box>
              </Fade>
            )}
          </Popper>
        </Box>

        <Button
          startIcon={<ChatBubbleOutline />}
          size="small"
          onClick={() => setShowComments(!showComments)}
          sx={{ color: theme.palette.text.secondary }}
        >
          {totalCommentsCount} Comments
        </Button>
        <Button startIcon={<Share />} size="small" sx={{ color: theme.palette.text.secondary }}>
          Share
        </Button>
      </CardActions>

      {showComments && (
        <>
          <CommentSection
            comments={postComments}
            onAddComment={handleAddComment}
            replyToComment={replyToComment}
            onReplyClick={setReplyToComment}
            onCancelReply={() => setReplyToComment(null)}
            onAddReply={handleAddReply}
            onEditClick={handleEditCommentClick}
            onDeleteClick={confirmDeleteComment}
            editingCommentId={editingCommentId}
            editingCommentText={editingCommentText}
            onEditingTextChange={setEditingCommentText}
          />
          {hasMore && (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
              <Button onClick={handleLoadMore} disabled={isLoading}>
                Load More
              </Button>
            </Box>
          )}
        </>
      )}

      <EditPostModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        caption={currentCaption}
        image={currentImage}
        onSave={handleSave}
      />

      <DeleteConfirmationModal
        open={isPostDeleteModalOpen}
        onClose={() => setIsPostDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Post"
        content="Are you sure you want to delete this post? This action cannot be undone."
      />

      <DeleteConfirmationModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteComment}
        title="Delete Comment"
        content="Are you sure you want to delete this comment? This action cannot be undone."
      />

      <Dialog
        open={isUpdateModalOpen}
        onClose={handleCancelUpdateComment}
        maxWidth="sm"
        fullWidth
        disableAutoFocus
        disableEnforceFocus
      >
        <DialogTitle>Edit Comment</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            fullWidth
            multiline
            rows={3}
            value={tempEditingText}
            onChange={(e) => setTempEditingText(e.target.value)}
            placeholder="Edit your comment here...."
            sx={{ mb: 2 }}
            disabled={isLoading}
          />

          {updateCommentImagePreview && (
            <Box sx={{ mb: 2 }}>
              <ImagePreview
                src={updateCommentImagePreview || '/placeholder.svg'}
                onRemove={() => setUpdateCommentImagePreview(null)}
                maxHeight="150px"
              />
            </Box>
          )}
          {!updateCommentImagePreview && (
            <Box sx={{ mb: 2 }}>
              <ImageUploadButton
                onChange={handleUpdateCommentImage}
                id="update-comment-image"
                buttonVariant="button"
                buttonText="Add Image"
                buttonProps={{ disabled: isLoading }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelUpdateComment} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleUpdateComment} variant="contained" disabled={isLoading}>
            {isLoading ? (
              <>
                <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                Updating...
              </>
            ) : (
              'Update'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}

MemePost.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  caption: PropTypes.string,
  image: PropTypes.string,
  timestamp: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired,
  onDelete: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onMenuOpen: PropTypes.func.isRequired,
  onMenuClose: PropTypes.func.isRequired,
  menuAnchor: PropTypes.object,
  isMenuOpen: PropTypes.bool.isRequired,
  darkMode: PropTypes.bool,
};

export default MemePost;
