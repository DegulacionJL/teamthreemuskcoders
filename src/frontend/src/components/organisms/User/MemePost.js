import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import React from 'react';
import { getComments } from 'services/comment.service';
import { ChatBubbleOutline, Share } from '@mui/icons-material';
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
  IconButton,
  Menu,
  MenuItem,
  Typography,
  useTheme,
} from '@mui/material';
import CommentFeature from 'components/organisms/CommentFeature';
import { useComments } from 'hooks/useComments'; // Import the useComments hook
import { useTheme as useCustomTheme } from 'theme/ThemeContext';
import DeleteConfirmationModal from '../DeleteConfirmationModal';
import EditPostModal from '../EditPostModal';
import LightBox from '../LightBox';
import ReportPostConfirmationModal from '../ReportPostModal';
import PostReactions from './PostReaction';

// Import the API function for fetching comments

function MemePost({
  id,
  caption,
  image,
  timestamp,
  user,
  loggedInUser,
  user,
  loggedInUser,
  onDelete,
  onReportPost,
  onUpdate,
  onMenuOpen,
  onMenuClose,
  menuAnchor,
  isMenuOpen,
  darkMode,
  onUserNameClick,
}) {
  const theme = useTheme();
  const { darkMode: contextDarkMode } = useCustomTheme();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentCaption, setCurrentCaption] = useState(caption);
  const [currentImage, setCurrentImage] = useState(image);
  const [isPostDeleteModalOpen, setIsPostDeleteModalOpen] = useState(false);
  const [isReportPostModalOpen, setIsReportPostModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [reactionType, setReactionType] = useState(null);
  const [likeCount, setLikeCount] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Use the useComments hook to get the total comment count
  const { totalCommentsCount } = useComments(id);

  const isDarkMode = darkMode !== undefined ? darkMode : contextDarkMode;

  useEffect(() => {
    const savedReaction = localStorage.getItem(`post_reaction_${id}`);
    const savedLikeCount = localStorage.getItem(`post_like_count_${id}`);

    if (savedReaction) {
      setReactionType(savedReaction);
    }

    if (savedLikeCount) {
      setLikeCount(Number.parseInt(savedLikeCount, 10));
    } else {
      setLikeCount(5); // Default value or fetch from API
    }
  }, [id]);

  useEffect(() => {
    setCurrentImage(image);
  }, [image]);

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
        setIsEditModalOpen(false);
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

  const handleConfirmReportPost = useCallback(async () => {
    setIsLoading(true);
    try {
      await onReportPost(id);
    } catch (error) {
      console.error('Error reporting this post: ', error);
    } finally {
      setIsLoading(false);
      setIsReportPostModalOpen(false);
    }
  }, [id, onReportPost]);

  const handleReactionChange = useCallback((postId, hasReacted, newReactionType, count) => {
    setLikeCount(count);
    setReactionType(newReactionType);

    if (hasReacted && newReactionType) {
      localStorage.setItem(`post_reaction_${postId}`, newReactionType);
    } else {
      localStorage.removeItem(`post_reaction_${postId}`);
    }
    localStorage.setItem(`post_like_count_${postId}`, count.toString());
  }, []);

  const fetchComments = async () => {
    setIsLoading(true);
    try {
      const response = await getComments(id); // Fetch comments from the backend
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageClick = async () => {
    if (currentImage) {
      await fetchComments(); // Fetch real comments for the lightbox
      setIsLightboxOpen(true);
    }
  };

  const handleAddComment = (text) => {
    if (!text.trim()) return;

    const newComment = {
      user: loggedInUser || {
        first_name: 'Current',
        last_name: 'User',
        avatar: '/placeholder.svg?height=40&width=40',
      },
      text: text,
    };

    setComments((prev) => [...prev, newComment]);

    // In a real app, you would send this to your backend
    console.log('New comment added:', newComment);
  };

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

    const formattedText = text.split('\n').map((line, i, arr) => (
      <React.Fragment key={i}>
        {line}
        {i < arr.length - 1 && <br />}
      </React.Fragment>
    ));

    return (
      <Typography
        variant="body1"
        component="div"
        sx={{
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        {formattedText}
      </Typography>
    );
  };

  const handleImageClick = () => {
    if (currentImage) {
      setIsLightboxOpen(true);
    }
  };

  return (
    <Card
      sx={{
        mb: 3,
        borderRadius: 1,
        overflow: 'visible',
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
            zIndex: 100,
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
          <Typography
            variant="subtitle1"
            fontWeight="medium"
            onClick={(e) => (user?.id && onUserNameClick ? onUserNameClick(e, user.id) : null)}
            sx={{
              cursor: user?.id && onUserNameClick ? 'pointer' : 'default',
              color: isDarkMode ? '#ffffff' : '#000000',
              color: isDarkMode ? '#ffffff' : '#000000',
              '&:hover':
                user?.id && onUserNameClick
                  ? {
                      textDecoration: 'underline',
                      color: isDarkMode ? theme.palette.primary.main : theme.palette.primary.dark,
                      color: isDarkMode ? theme.palette.primary.main : theme.palette.primary.dark,
                    }
                  : {},
            }}
          >
            {user
              ? `${user.first_name?.charAt(0).toUpperCase() + user.first_name?.slice(1)} ${
                  user.last_name?.charAt(0).toUpperCase() + user.last_name?.slice(1)
                }`
              : 'Unknown User'}
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
        <MenuItem onClick={() => setIsReportPostModalOpen(true)}>Report</MenuItem>
        <MenuItem onClick={() => setIsPostDeleteModalOpen(true)} sx={{ color: 'red' }}>
          Delete
        </MenuItem>
      </Menu>

      <CardContent sx={{ pt: 0, pb: 1 }}>
        <Box sx={{ mb: 2, mt: 2 }}>{formatCaption(currentCaption)}</Box>
      </CardContent>

      {currentImage && (
        <CardMedia
          component="img"
          image={currentImage}
          alt="Meme"
          onClick={handleImageClick}
          sx={{
            maxHeight: 500,
            objectFit: 'contain',
            bgcolor: isDarkMode ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.03)',
            cursor: 'pointer',
            cursor: 'pointer',
          }}
        />
      )}

      <LightBox
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        image={currentImage}
        caption={currentCaption}
        user={user}
        timestamp={timestamp}
        comments={comments || []}
        reactionCount={likeCount}
        onAddComment={handleAddComment}
        darkMode={isDarkMode}
      />

      <CardActions disableSpacing sx={{ p: 0 }}>
        <PostReactions
          postId={id}
          isDarkMode={isDarkMode}
          onReactionChange={handleReactionChange}
          initialReactionType={reactionType}
        />
        <Button
          startIcon={<ChatBubbleOutline />}
          size="small"
          onClick={() => setShowComments(!showComments)}
          sx={{ color: theme.palette.text.secondary }}
        >
          Comments {totalCommentsCount > 0 && `(${totalCommentsCount})`}{' '}
          {/* Display comment count */}
        </Button>
        <Button startIcon={<Share />} size="small" sx={{ color: theme.palette.text.secondary }}>
          Share
        </Button>
      </CardActions>

      <Box
        sx={{
          px: 0,
          pb: 0,
          mt: 0,
          display: 'flex',
          alignItems: 'center',
          mx: 1,
        }}
      >
        {likeCount > 0 && (
          <Typography
            variant="caption"
            sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', py: 0 }}
          >
            <span
              role="img"
              aria-label="laughing emoji"
              style={{ marginRight: '4px', fontSize: '16px' }}
            >
              😂
            </span>
            {likeCount}
          </Typography>
        )}
      </Box>

      {showComments && <CommentFeature postId={id} user={loggedInUser} />}

      <EditPostModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        caption={currentCaption}
        image={currentImage}
        onSave={handleSave}
      />

      <ReportPostConfirmationModal
        open={isReportPostModalOpen}
        onClose={() => setIsReportPostModalOpen(false)}
        onConfirm={handleConfirmReportPost}
        title="Report Post"
        content="Are you sure you want to report this Post? This action cannot be undone."
      />

      <DeleteConfirmationModal
        open={isPostDeleteModalOpen}
        onClose={() => setIsPostDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Post"
        content="Are you sure you want to delete this post? This action cannot be undone."
      />
    </Card>
  );
}

MemePost.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  caption: PropTypes.string,
  image: PropTypes.string,
  timestamp: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired,
  loggedInUser: PropTypes.object,
  loggedInUser: PropTypes.object,
  onDelete: PropTypes.func.isRequired,
  onReportPost: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onMenuOpen: PropTypes.func.isRequired,
  onMenuClose: PropTypes.func.isRequired,
  menuAnchor: PropTypes.object,
  isMenuOpen: PropTypes.bool.isRequired,
  darkMode: PropTypes.bool,
  onUserNameClick: PropTypes.func,
};

export default MemePost;
