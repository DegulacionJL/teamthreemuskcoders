'use client';

import PropTypes from 'prop-types';
import { useCallback, useEffect, useRef, useState } from 'react';
import { getCommentLikes, likeComment, unlikeComment } from 'services/comment.service';
// Use new services
import { FavoriteBorder } from '@mui/icons-material';
import { Box, Button, CircularProgress, Fade, Popper, Typography } from '@mui/material';
import AnimatedEmoji from '../../atoms/animation/AnimatedEmoji';

const CommentReactions = ({ commentId, isDarkMode, onReactionChange, initialReactionType }) => {
  const [showReactions, setShowReactions] = useState(false);
  const [hasReacted, setHasReacted] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const likeButtonRef = useRef(null);

  // Fetch initial like data for comments
  useEffect(() => {
    const fetchLikes = async () => {
      setIsInitializing(true);
      try {
        // Try to get data from localStorage first for immediate display
        const storedReaction = localStorage.getItem(`comment_reaction_${commentId}`);
        const storedLikeCount = localStorage.getItem(`comment_like_count_${commentId}`);

        if (storedReaction) {
          setHasReacted(true);
        }

        if (storedLikeCount) {
          setLikeCount(Number.parseInt(storedLikeCount, 10));
        }

        // Then fetch from server
        const response = await getCommentLikes(commentId);

        if (response) {
          setLikeCount(response.like_count || 0);
          setHasReacted(response.user_has_liked || false);

          // Update localStorage with fresh data
          if (response.user_has_liked) {
            localStorage.setItem(`comment_reaction_${commentId}`, initialReactionType || '😂');
          } else {
            localStorage.removeItem(`comment_reaction_${commentId}`);
          }

          localStorage.setItem(`comment_like_count_${commentId}`, response.like_count.toString());
        }
      } catch (error) {
        console.error('Error fetching comment likes:', error);
        // Keep using localStorage data if API fails
      } finally {
        setIsInitializing(false);
      }
    };

    fetchLikes();
  }, [commentId, initialReactionType]);

  // Notify parent component when like count changes
  useEffect(() => {
    if (onReactionChange && !isInitializing) {
      onReactionChange(commentId, hasReacted, hasReacted ? '😂' : null, likeCount);
    }
  }, [commentId, hasReacted, likeCount, onReactionChange, isInitializing]);

  const handleReaction = useCallback(async () => {
    if (isLoading || hasReacted) return;

    setIsLoading(true);
    setHasReacted(true);
    setShowReactions(false);

    // Optimistically update UI
    setLikeCount((prev) => prev + 1);

    try {
      const response = await likeComment(commentId);

      if (response && response.like_count !== undefined) {
        setLikeCount(response.like_count);
      }

      // Update localStorage
      localStorage.setItem(`comment_reaction_${commentId}`, '😂');
      localStorage.setItem(
        `comment_like_count_${commentId}`,
        response?.like_count?.toString() || (likeCount + 1).toString()
      );
    } catch (error) {
      setHasReacted(false);
      setLikeCount((prev) => Math.max(0, prev - 1));
      console.error('Error while reacting to the comment:', error);
    } finally {
      setIsLoading(false);
    }
  }, [commentId, hasReacted, isLoading, likeCount]);

  const handleToggleReaction = useCallback(async () => {
    if (isLoading) return;

    setIsLoading(true);
    const newReactionState = !hasReacted;

    // Optimistically update UI
    setHasReacted(newReactionState);
    setLikeCount((prev) => (newReactionState ? prev + 1 : Math.max(0, prev - 1)));

    try {
      let response;
      if (newReactionState) {
        response = await likeComment(commentId);
        localStorage.setItem(`comment_reaction_${commentId}`, '😂');
      } else {
        response = await unlikeComment(commentId);
        localStorage.removeItem(`comment_reaction_${commentId}`);
      }

      if (response && response.like_count !== undefined) {
        setLikeCount(response.like_count);
        localStorage.setItem(`comment_like_count_${commentId}`, response.like_count.toString());
      }
    } catch (error) {
      setHasReacted(!newReactionState);
      setLikeCount((prev) => (!newReactionState ? prev + 1 : Math.max(0, prev - 1)));
      console.error('Error while toggling comment reaction:', error);
    } finally {
      setIsLoading(false);
    }
  }, [hasReacted, commentId, isLoading]);

  return (
    <Box sx={{ position: 'relative' }}>
      <Button
        ref={likeButtonRef}
        startIcon={
          isLoading ? (
            <CircularProgress size={16} color="inherit" />
          ) : hasReacted ? (
            <Typography sx={{ fontSize: '16px' }}>😂</Typography>
          ) : (
            <FavoriteBorder />
          )
        }
        size="small"
        sx={{
          color: hasReacted ? 'primary.main' : 'text.secondary',
          fontWeight: hasReacted ? 'bold' : 'normal',
        }}
        onMouseEnter={() => !hasReacted && !isLoading && setShowReactions(true)}
        onMouseLeave={() => setTimeout(() => setShowReactions(false), 300)}
        onClick={handleToggleReaction}
        disabled={isLoading || isInitializing}
      >
        {hasReacted ? 'Haha' : 'Like'} {likeCount > 0 && `(${likeCount})`}
      </Button>

      <Popper
        open={showReactions && !isLoading}
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

CommentReactions.propTypes = {
  commentId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  isDarkMode: PropTypes.bool.isRequired,
  onReactionChange: PropTypes.func,
  initialReactionType: PropTypes.string,
};

export default CommentReactions;
