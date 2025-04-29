import { useComments } from 'hooks/useComments';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Close as CloseIcon, Send as SendIcon } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  IconButton,
  InputBase,
  Paper,
  Typography,
  useTheme,
} from '@mui/material';
import PostReactions from 'components/organisms/User/PostReaction';

export default function LightBox({
  isOpen,
  onClose,
  image,
  caption,
  user,
  timestamp,
  postId,
  reactionCount = 0,
  darkMode,
}) {
  const theme = useTheme();
  const [likeCount, setLikeCount] = useState(reactionCount);
  const [reactionType, setReactionType] = useState(null);
  const [totalCommentsCount, setTotalCommentsCount] = useState(0);
  const [replyInputVisible, setReplyInputVisible] = useState(false);

  const {
    comments,
    isLoading: commentsLoading,
    hasMore,
    handleAddComment,
    handleLoadMore,
    handleAddReply,
    handleLoadMoreReplies,
    replyToComment,
    setReplyToComment,
    handleCommentReactionChange,
  } = useComments(postId);

  const handleReactionChange = async (postId, hasReacted, newReactionType, count) => {
    try {
      setLikeCount(count);
      setReactionType(newReactionType);
    } catch (error) {
      console.error('Error toggling reaction:', error);
    }
  };

  const fetchTotalCommentsCount = async () => {
    try {
      const response = await fetch(`/api/posts/${postId}/comments/count`);
      const data = await response.json();
      setTotalCommentsCount(data.total_with_replies || 0);
    } catch (error) {
      console.error('Error fetching total comments count:', error);
    }
  };

  useEffect(() => {
    fetchTotalCommentsCount();
  }, [postId]);

  const getRelativeTime = (timestamp) => {
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
  };

  const formatCaption = (text) => {
    if (!text) return '';

    return text.split('\n').map((line, i, arr) => (
      <React.Fragment key={i}>
        {line}
        {i < arr.length - 1 && <br />}
      </React.Fragment>
    ));
  };

  // Function to handle replying to comments
  const handleReplyClick = (comment) => {
    setReplyToComment(comment);
    setReplyInputVisible(true);
  };

  // Function to cancel reply
  const handleCancelReply = () => {
    setReplyToComment(null);
    setReplyInputVisible(false);
  };

  // Function to submit a reply
  const submitReply = (text) => {
    if (replyToComment && text.trim()) {
      handleAddReply(replyToComment.id, text);
      setReplyInputVisible(false);
      setReplyToComment(null);
    }
  };

  // Function to load more replies
  const loadReplies = (commentId) => {
    handleLoadMoreReplies(commentId);
  };

  // Function to handle comment reactions
  const toggleCommentReaction = (commentId, hasReacted, reactionType) => {
    handleCommentReactionChange(commentId, hasReacted, reactionType);
  };

  if (!isOpen) {
    return null;
  }

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
                  bgcolor: theme.palette.mode === 'dark' ? '#4a3b6b' : theme.palette.primary.light,
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

          {/* Reactions */}
          <Box sx={{ p: 2 }}>
            <PostReactions
              postId={postId}
              isDarkMode={darkMode}
              onReactionChange={handleReactionChange}
              initialReactionType={reactionType}
              initialLikeCount={likeCount}
            />
            <Typography variant="caption" color="text.secondary">
              {likeCount} {likeCount === 1 ? 'reaction' : 'reactions'} • {totalCommentsCount}{' '}
              {totalCommentsCount === 1 ? 'comment' : 'comments'}
            </Typography>
          </Box>

          {/* Comments section */}
          <Box
            sx={{
              flex: 1,
              overflowY: 'auto',
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            {comments.map((comment, index) => (
              <Box key={index} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {/* Main comment */}
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Avatar
                    src={comment.user?.avatar || ''}
                    alt={comment.user?.first_name || 'User'}
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor:
                        theme.palette.mode === 'dark' ? '#4a3b6b' : theme.palette.primary.light,
                    }}
                  >
                    {comment.user
                      ? `${comment.user.first_name?.charAt(0) || ''}${
                          comment.user.last_name?.charAt(0) || ''
                        }`
                      : 'U'}
                  </Avatar>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, flexGrow: 1 }}>
                    <Box
                      sx={{
                        bgcolor:
                          theme.palette.mode === 'dark'
                            ? 'rgba(255, 255, 255, 0.05)'
                            : 'rgba(0, 0, 0, 0.05)',
                        borderRadius: '16px',
                        px: 1.5,
                        py: 1,
                        maxWidth: '85%',
                      }}
                    >
                      <Typography variant="subtitle2" sx={{ fontSize: '0.875rem' }}>
                        {comment.user
                          ? `${comment.user.first_name} ${comment.user.last_name}`
                          : 'Unknown User'}
                      </Typography>
                      <Typography variant="body2">{comment.text}</Typography>
                    </Box>

                    {/* Comment Actions */}
                    <Box sx={{ display: 'flex', gap: 1, ml: 1 }}>
                      <Button
                        size="small"
                        variant="text"
                        sx={{ fontSize: '0.75rem', py: 0, minWidth: 'auto' }}
                        onClick={() => handleReplyClick(comment)}
                      >
                        Reply
                      </Button>

                      <Button
                        size="small"
                        variant="text"
                        sx={{ fontSize: '0.75rem', py: 0, minWidth: 'auto' }}
                        onClick={() =>
                          toggleCommentReaction(comment.id, comment.hasReacted, 'like')
                        }
                      >
                        {comment.hasReacted ? 'Unlike' : 'Like'}
                      </Button>
                    </Box>
                  </Box>
                </Box>

                {/* Comment Replies */}
                {comment.replies && comment.replies.length > 0 && (
                  <Box sx={{ pl: 4 }}>
                    {comment.replies.map((reply, replyIndex) => (
                      <Box key={replyIndex} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                        <Avatar
                          src={reply.user?.avatar || ''}
                          alt={reply.user?.first_name || 'User'}
                          sx={{
                            width: 24,
                            height: 24,
                            bgcolor:
                              theme.palette.mode === 'dark'
                                ? '#4a3b6b'
                                : theme.palette.primary.light,
                          }}
                        >
                          {reply.user
                            ? `${reply.user.first_name?.charAt(0) || ''}${
                                reply.user.last_name?.charAt(0) || ''
                              }`
                            : 'U'}
                        </Avatar>
                        <Box
                          sx={{
                            bgcolor:
                              theme.palette.mode === 'dark'
                                ? 'rgba(255, 255, 255, 0.05)'
                                : 'rgba(0, 0, 0, 0.05)',
                            borderRadius: '16px',
                            px: 1.5,
                            py: 1,
                            maxWidth: '85%',
                          }}
                        >
                          <Typography variant="subtitle2" sx={{ fontSize: '0.75rem' }}>
                            {reply.user
                              ? `${reply.user.first_name} ${reply.user.last_name}`
                              : 'Unknown User'}
                          </Typography>
                          <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                            {reply.text}
                          </Typography>
                        </Box>
                      </Box>
                    ))}

                    {comment.hasMoreReplies && (
                      <Button
                        size="small"
                        onClick={() => loadReplies(comment.id)}
                        sx={{ ml: 4, fontSize: '0.75rem' }}
                      >
                        Load more replies
                      </Button>
                    )}
                  </Box>
                )}

                {/* Reply Input */}
                {replyToComment && replyToComment.id === comment.id && replyInputVisible && (
                  <Box sx={{ pl: 4, display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Avatar
                      sx={{
                        width: 24,
                        height: 24,
                        bgcolor:
                          theme.palette.mode === 'dark' ? '#4a3b6b' : theme.palette.primary.light,
                      }}
                    >
                      {user?.first_name?.charAt(0) || 'U'}
                    </Avatar>
                    <Paper
                      variant="outlined"
                      sx={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        borderRadius: '24px',
                        pl: 2,
                        pr: 1,
                        py: 0.5,
                        bgcolor:
                          theme.palette.mode === 'dark'
                            ? 'rgba(255, 255, 255, 0.05)'
                            : 'rgba(0, 0, 0, 0.05)',
                      }}
                    >
                      <InputBase
                        placeholder="Write a reply..."
                        sx={{ flex: 1, fontSize: '0.875rem' }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && e.target.value.trim()) {
                            submitReply(e.target.value);
                            e.target.value = '';
                          } else if (e.key === 'Escape') {
                            handleCancelReply();
                          }
                        }}
                      />
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => {
                          const input = document.querySelector(
                            'input[placeholder="Write a reply..."]'
                          );
                          if (input && input.value.trim()) {
                            submitReply(input.value);
                            input.value = '';
                          }
                        }}
                      >
                        <SendIcon fontSize="small" />
                      </IconButton>
                    </Paper>
                    <Button size="small" variant="text" onClick={handleCancelReply}>
                      Cancel
                    </Button>
                  </Box>
                )}
              </Box>
            ))}

            {comments.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  No comments yet. Be the first to comment!
                </Typography>
              </Box>
            )}

            {hasMore && (
              <Button
                onClick={handleLoadMore}
                sx={{ alignSelf: 'center', mt: 2 }}
                disabled={commentsLoading}
              >
                Load More
              </Button>
            )}
          </Box>

          {/* Comment input */}
          <Box sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}`, mt: 'auto' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: theme.palette.mode === 'dark' ? '#4a3b6b' : theme.palette.primary.light,
                }}
              >
                {user?.first_name?.charAt(0) || 'U'}
              </Avatar>
              <Paper
                variant="outlined"
                sx={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  borderRadius: '24px',
                  pl: 2,
                  pr: 1,
                  py: 0.5,
                  bgcolor:
                    theme.palette.mode === 'dark'
                      ? 'rgba(255, 255, 255, 0.05)'
                      : 'rgba(0, 0, 0, 0.05)',
                }}
              >
                <InputBase
                  placeholder="Write a comment..."
                  sx={{ flex: 1, fontSize: '0.875rem' }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.target.value.trim() && handleAddComment) {
                      handleAddComment(e.target.value);
                      e.target.value = '';
                    }
                  }}
                />
                <IconButton
                  size="small"
                  color="primary"
                  onClick={() => {
                    const input = document.querySelector('input[placeholder="Write a comment..."]');
                    if (input && input.value.trim() && handleAddComment) {
                      handleAddComment(input.value);
                      input.value = '';
                    }
                  }}
                >
                  <SendIcon fontSize="small" />
                </IconButton>
              </Paper>
            </Box>
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
  postId: PropTypes.number.isRequired,
  reactionCount: PropTypes.number,
  darkMode: PropTypes.bool,
};
