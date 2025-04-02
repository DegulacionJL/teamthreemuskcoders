'use client';

import PropTypes from 'prop-types';
import { useCallback, useEffect, useRef, useState } from 'react';
import { getLikes, likePost, unlikePost } from 'services/meme.service';
import { FavoriteBorder } from '@mui/icons-material';
import { Box, Button, Fade, Popper, Typography } from '@mui/material';
import AnimatedEmoji from '../../atoms/animation/AnimatedEmoji';

const PostReactions = ({ postId, isDarkMode, onReactionChange }) => {
  const [showReactions, setShowReactions] = useState(false);
  const [hasReacted, setHasReacted] = useState(false);
  const [likeCount, setLikeCount] = useState(5); // Default to 5 for testing
  const likeButtonRef = useRef(null);
  // Add a way to get the current user ID from your auth system
  const currentUserId = 'user123'; // Replace with your actual user ID retrieval logic

  // Separate the data fetching from the parent notification to avoid infinite loops
  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const response = await getLikes(postId);
        setLikeCount(response.like_count || 0);

        if (response.likes && Array.isArray(response.likes)) {
          setHasReacted(response.likes.some((like) => like.user_id === currentUserId));
        }
      } catch (error) {
        console.error('Error fetching likes:', error);
      }
    };

    fetchLikes();
  }, [postId, currentUserId]); // Remove hasReacted from dependencies

  // Notify parent component when like count changes
  useEffect(() => {
    if (onReactionChange) {
      onReactionChange(postId, hasReacted, '😂', likeCount);
    }
  }, [postId, hasReacted, likeCount, onReactionChange]);

  const handleReaction = useCallback(async () => {
    setHasReacted(true);
    setShowReactions(false);

    try {
      await likePost(postId);
      setLikeCount((prev) => prev + 1);
    } catch (error) {
      console.error('Error while reacting to the post:', error);
    }
  }, [postId]);

  const handleToggleReaction = useCallback(async () => {
    const newReactionState = !hasReacted;

    // Optimistically update UI
    setHasReacted(newReactionState);
    setLikeCount((prev) => (newReactionState ? prev + 1 : Math.max(0, prev - 1)));

    try {
      if (newReactionState) {
        await likePost(postId);
      } else {
        await unlikePost(postId);
      }
    } catch (error) {
      // Revert UI state if API call fails
      setHasReacted(!newReactionState);
      setLikeCount((prev) => (!newReactionState ? prev + 1 : Math.max(0, prev - 1)));
      console.error('Error while toggling reaction:', error);
    }
  }, [hasReacted, postId]);

  return (
    <Box sx={{ position: 'relative' }}>
      {/* Like Button Only - Since Comment & Share Are Already in memePost.js */}
      <Button
        ref={likeButtonRef}
        startIcon={
          hasReacted ? <Typography sx={{ fontSize: '16px' }}>😂</Typography> : <FavoriteBorder />
        }
        size="small"
        sx={{ color: 'text.secondary' }}
        onMouseEnter={() => !hasReacted && setShowReactions(true)}
        onMouseLeave={() => setTimeout(() => setShowReactions(false), 300)}
        onClick={handleToggleReaction}
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
  );
};

PostReactions.propTypes = {
  postId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  isDarkMode: PropTypes.bool.isRequired,
  onReactionChange: PropTypes.func,
};

export default PostReactions;
