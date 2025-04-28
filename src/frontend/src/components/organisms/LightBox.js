import PropTypes from 'prop-types';
import React from 'react';
import { Close as CloseIcon } from '@mui/icons-material';
import { Avatar, Box, IconButton, Typography, useTheme } from '@mui/material';
import CommentFeature from 'components/organisms/CommentFeature';
import { useComments } from 'hooks/useComments';

export default function LightBox({
  isOpen,
  onClose,
  image,
  caption,
  user,
  timestamp,
  postId,
  darkMode,
}) {
  const theme = useTheme();
  const isDarkMode = darkMode !== undefined ? darkMode : theme.palette.mode === 'dark';

  // Use the useComments hook to manage comments state
  const {
    comments,
    isLoading: commentsLoading,
    hasMore,
    editingCommentId,
    editingCommentText,
    tempEditingText,
    commentImage,
    updateCommentImagePreview,
    isUpdateModalOpen,
    replyToComment,
    commentToDelete,
    isDeleteModalOpen,
    replyLoading,
    setReplyToComment,
    setTempEditingText,
    setCommentImage,
    setUpdateCommentImagePreview,
    setIsUpdateModalOpen,
    setIsDeleteModalOpen,
    handleAddComment,
    handleAddReply,
    confirmDeleteComment,
    handleDeleteComment,
    handleEditCommentClick,
    handleUpdateCommentImage,
    handleUpdateComment,
    handleCancelUpdateComment,
    handleLoadMore,
    handleLoadMoreReplies,
    handleCommentReactionChange,
  } = useComments(postId);

  if (!isOpen) {
    return null;
  }

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

  const formatCaption = (text) => {
    if (!text) return '';

    return text.split('\n').map((line, i, arr) => (
      <React.Fragment key={i}>
        {line}
        {i < arr.length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: 1300,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          width: '100%',
          height: '100%',
          maxWidth: '1200px',
          maxHeight: '90vh',
          bgcolor: theme.palette.background.paper,
        }}
      >
        {/* Close button */}
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            zIndex: 10,
            bgcolor: 'rgba(0, 0, 0, 0.2)',
            color: 'white',
            '&:hover': {
              bgcolor: 'rgba(0, 0, 0, 0.4)',
            },
          }}
        >
          <CloseIcon />
        </IconButton>

        {/* Image section */}
        <Box
          sx={{
            flex: 1,
            bgcolor: 'black',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
          }}
        >
          <img
            src={image || '/placeholder.svg'}
            alt="Post image"
            style={{
              maxHeight: '100%',
              maxWidth: '100%',
              objectFit: 'contain',
            }}
          />
        </Box>

        {/* Comments and info section */}
        <Box
          sx={{
            width: { xs: '100%', md: '380px' },
            bgcolor: theme.palette.background.paper,
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
          }}
        >
          {/* Post info */}
          <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
              <Avatar
                src={user?.avatar || ''}
                alt={user?.first_name || 'User'}
                sx={{
                  bgcolor: isDarkMode ? '#4a3b6b' : theme.palette.primary.light,
                }}
              >
                {user
                  ? `${user.first_name?.charAt(0) || ''}${user.last_name?.charAt(0) || ''}`
                  : 'U'}
              </Avatar>
              <Box>
                <Typography variant="subtitle2">
                  {user
                    ? `${user.first_name?.charAt(0).toUpperCase() + user.first_name?.slice(1)} ${
                        user.last_name?.charAt(0).toUpperCase() + user.last_name?.slice(1)
                      }`
                    : 'Unknown User'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {getRelativeTime(timestamp)}
                </Typography>
              </Box>
            </Box>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
              {formatCaption(caption)}
            </Typography>
          </Box>

          {/* Comment Feature */}
          <Box sx={{ flex: 1, overflowY: 'auto' }}>
            <CommentFeature
              postId={postId}
              user={user}
              comments={comments}
              isLoading={commentsLoading}
              hasMore={hasMore}
              editingCommentId={editingCommentId}
              editingCommentText={editingCommentText}
              tempEditingText={tempEditingText}
              commentImage={commentImage}
              updateCommentImagePreview={updateCommentImagePreview}
              isUpdateModalOpen={isUpdateModalOpen}
              replyToComment={replyToComment}
              commentToDelete={commentToDelete}
              isDeleteModalOpen={isDeleteModalOpen}
              replyLoading={replyLoading}
              setReplyToComment={setReplyToComment}
              setTempEditingText={setTempEditingText}
              setCommentImage={setCommentImage}
              setUpdateCommentImagePreview={setUpdateCommentImagePreview}
              setIsUpdateModalOpen={setIsUpdateModalOpen}
              setIsDeleteModalOpen={setIsDeleteModalOpen}
              handleAddComment={handleAddComment}
              handleAddReply={handleAddReply}
              confirmDeleteComment={confirmDeleteComment}
              handleDeleteComment={handleDeleteComment}
              handleEditCommentClick={handleEditCommentClick}
              handleUpdateCommentImage={handleUpdateCommentImage}
              handleUpdateComment={handleUpdateComment}
              handleCancelUpdateComment={handleCancelUpdateComment}
              handleLoadMore={handleLoadMore}
              handleLoadMoreReplies={handleLoadMoreReplies}
              handleCommentReactionChange={handleCommentReactionChange}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

LightBox.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  image: PropTypes.string,
  caption: PropTypes.string,
  user: PropTypes.shape({
    avatar: PropTypes.string,
    first_name: PropTypes.string,
    last_name: PropTypes.string,
  }),
  timestamp: PropTypes.string,
  postId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  darkMode: PropTypes.bool,
};
