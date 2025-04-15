import PropTypes from 'prop-types';
import { useCallback, useEffect, useRef, useState } from 'react';
import { getCommentLikes, likeComment, unlikeComment } from 'services/comment.service';
import { Box, Button, CircularProgress, Fade, Popper, Typography } from '@mui/material';
import AnimatedEmoji from '../../atoms/animation/AnimatedEmoji';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';

const CommentReactions = ({ commentId, isDarkMode, onReactionChange }) => {
  const [showReactions, setShowReactions] = useState(false);
  const [hasReacted, setHasReacted] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const likeButtonRef = useRef(null);

  const fetchLikes = useCallback(async () => {
    try {
      const response = await getCommentLikes(commentId);
      setLikeCount(response.like_count || 0);
      setHasReacted(response.user_has_liked || false);
      localStorage.setItem(`comment_reaction_${commentId}`, response.user_has_liked ? '😂' : '');
      localStorage.setItem(`comment_like_count_${commentId}`, response.like_count.toString());
    } catch (error) {
      console.error('Error fetching comment likes:', error);
    }
  }, [commentId]);

  useEffect(() => {
    const initializeLikes = async () => {
      setIsInitializing(true);
      await fetchLikes();
      setIsInitializing(false);
    };
    initializeLikes();
  }, [fetchLikes]);

  useEffect(() => {
    if (onReactionChange && !isInitializing) {
      onReactionChange(commentId, hasReacted, hasReacted ? '😂' : null, likeCount);
    }
  }, [commentId, hasReacted, likeCount, onReactionChange, isInitializing]);

  const handleReaction = useCallback(async () => {
    if (isLoading || hasReacted) return;

    setIsLoading(true);
    try {
      const response = await likeComment(commentId);
      // Optimistically update state based on the response
      setHasReacted(response.user_has_liked || true);
      setLikeCount(response.like_count || likeCount + 1);
      localStorage.setItem(`comment_reaction_${commentId}`, '😂');
      localStorage.setItem(`comment_like_count_${commentId}`, response.like_count.toString());
      // Fetch latest state to confirm
      await fetchLikes();
    } catch (error) {
      console.error('Error while reacting to the comment:', error);
      setHasReacted(false); // Rollback on error
      setLikeCount((prev) => Math.max(0, prev - 1));
    } finally {
      setIsLoading(false);
      setShowReactions(false);
    }
  }, [commentId, hasReacted, isLoading, likeCount, fetchLikes]);

  const handleToggleReaction = useCallback(async () => {
    if (isLoading) return;

    setIsLoading(true);
    const prevHasReacted = hasReacted;
    const prevLikeCount = likeCount;

    try {
      if (hasReacted) {
        const response = await unlikeComment(commentId);
        setHasReacted(response.user_has_liked || false);
        setLikeCount(response.like_count || Math.max(0, prevLikeCount - 1));
        localStorage.setItem(`comment_reaction_${commentId}`, '');
        localStorage.setItem(`comment_like_count_${commentId}`, response.like_count.toString());
      } else {
        const response = await likeComment(commentId);
        setHasReacted(response.user_has_liked || true);
        setLikeCount(response.like_count || prevLikeCount + 1);
        localStorage.setItem(`comment_reaction_${commentId}`, '😂');
        localStorage.setItem(`comment_like_count_${commentId}`, response.like_count.toString());
      }
      // Fetch latest state to confirm
      await fetchLikes();
    } catch (error) {
      console.error('Error while toggling comment reaction:', error);
      setHasReacted(prevHasReacted); // Rollback on error
      setLikeCount(prevLikeCount);
    } finally {
      setIsLoading(false);
    }
  }, [hasReacted, commentId, isLoading, likeCount, fetchLikes]);

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
            <EmojiEmotionsIcon />
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
        {hasReacted ? 'Laugh' : 'Laugh'} {likeCount > 0 && `(${likeCount})`}
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
};

export default CommentReactions;
