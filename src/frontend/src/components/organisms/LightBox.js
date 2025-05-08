import { useComments } from 'hooks/useComments';
import PropTypes from 'prop-types';
import React, { useRef, useState } from 'react';
import { ChatBubbleOutline, Close as CloseIcon } from '@mui/icons-material';
import { Avatar, Box, Button, IconButton, Typography, useTheme } from '@mui/material';
import CommentFeature from 'components/organisms/CommentFeature';
import PostReaction from 'components/organisms/User/PostReaction';
import { getRelativeTime } from 'utils/timeUtils';

export default function LightBox({
  isOpen,
  onClose,
  image,
  caption,
  user,
  timestamp,
  postId,
  darkMode,
  onReactionChange,
  initialReactionType,
  initialReactionCount,
  totalCommentsCount,
  onCommentCountChange,
}) {
  const theme = useTheme();
  const isDarkMode = darkMode !== undefined ? darkMode : theme.palette.mode === 'dark';
  const [showComments, setShowComments] = useState(true);
  const hasFetchedComments = useRef(false);

  // Add a no-op function to prevent total-count API call
  const noopCommentCountChange = () => {};

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
    fetchComments,
  } = useComments(postId, {
    fetchCountOnMount: false,
    onCommentCountChange,
  });

  // Fetch comments when LightBox opens
  React.useEffect(() => {
    if (isOpen && !hasFetchedComments.current) {
      fetchComments(1);
    }
  }, [isOpen, fetchComments]);

  if (!isOpen) {
    return null;
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

  const handleToggleComments = () => {
    setShowComments((prev) => {
      const newValue = !prev;
      if (newValue && !hasFetchedComments.current) {
        fetchComments(1);
      }
      return newValue;
    });
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

        <Box
          sx={{
            width: { xs: '100%', md: '380px' },
            bgcolor: theme.palette.background.paper,
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
          }}
        >
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

          <Box
            sx={{
              p: 1,
              borderBottom: `1px solid ${theme.palette.divider}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <PostReaction
              postId={postId}
              isDarkMode={isDarkMode}
              onReactionChange={onReactionChange}
              initialReactionType={initialReactionType}
              initialReactionCount={initialReactionCount}
            />
            <Button
              startIcon={<ChatBubbleOutline />}
              size="small"
              onClick={handleToggleComments}
              sx={{ color: theme.palette.text.secondary }}
            >
              Comments {totalCommentsCount > 0 && `(${totalCommentsCount})`}
            </Button>
          </Box>

          {showComments && (
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
                onCommentCountChange={onCommentCountChange}
              />
            </Box>
          )}
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
  onReactionChange: PropTypes.func,
  initialReactionType: PropTypes.string,
  initialReactionCount: PropTypes.number,
  totalCommentsCount: PropTypes.number,
  onCommentCountChange: PropTypes.func,
};
