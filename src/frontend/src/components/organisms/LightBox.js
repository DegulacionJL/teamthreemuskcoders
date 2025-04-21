import PropTypes from 'prop-types';
import React from 'react';
import {
  ChatBubbleOutline,
  Close as CloseIcon,
  Send as SendIcon,
  Share as ShareIcon,
} from '@mui/icons-material';
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

export default function LightBox({
  isOpen,
  onClose,
  image,
  caption,
  user,
  timestamp,
  comments = [],
  reactionCount = 0,
  onAddComment,
  // darkMode,
}) {
  const theme = useTheme();
  // const isDarkMode = darkMode !== undefined ? darkMode : theme.palette.mode === 'dark';

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
          <Box sx={{ p: 0 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                pt: 1,
              }}
            >
              <Button
                startIcon={<Typography sx={{ fontSize: 16 }}>😂</Typography>}
                size="small"
                sx={{
                  flex: 1,
                  color: theme.palette.text.secondary,
                  borderBottom: `1px solid ${theme.palette.divider}`,
                }}
              >
                Laugh
              </Button>
              <Button
                startIcon={<ChatBubbleOutline />}
                size="small"
                sx={{
                  flex: 1,
                  color: theme.palette.text.secondary,
                  borderBottom: `1px solid ${theme.palette.divider}`,
                }}
              >
                Comment
              </Button>
              <Button
                startIcon={<ShareIcon />}
                size="small"
                sx={{
                  flex: 1,
                  color: theme.palette.text.secondary,
                  borderBottom: `1px solid ${theme.palette.divider}`,
                }}
              >
                Share
              </Button>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box sx={{ bgcolor: theme.palette.primary.main, borderRadius: '50%', p: 0.5 }}>
                  <Typography sx={{ fontSize: 10, color: 'white' }}>😂</Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  {reactionCount}
                </Typography>
              </Box>
              <Typography variant="caption" color="text.secondary">
                {comments.length} comments
              </Typography>
            </Box>
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
              <Box key={index} sx={{ display: 'flex', gap: 1 }}>
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
              </Box>
            ))}

            {comments.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  No comments yet. Be the first to comment!
                </Typography>
              </Box>
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
                YO
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
                    if (e.key === 'Enter' && onAddComment) {
                      onAddComment(e.target.value);
                      e.target.value = '';
                    }
                  }}
                />
                <IconButton
                  size="small"
                  color="primary"
                  onClick={() => {
                    const input = document.querySelector('input[placeholder="Write a comment..."]');
                    if (input && onAddComment) {
                      onAddComment(input.value);
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
  comments: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string,
      user: PropTypes.shape({
        avatar: PropTypes.string,
        first_name: PropTypes.string,
        last_name: PropTypes.string,
      }),
    })
  ),
  reactionCount: PropTypes.number,
  onAddComment: PropTypes.func,
  darkMode: PropTypes.bool,
};
