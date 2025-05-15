import PropTypes from 'prop-types';
import { useCallback, useEffect, useRef, useState } from 'react';
import { likeComment, unlikeComment } from 'services/comment.service';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import { Box, Button, CircularProgress, Fade, Popper, Typography } from '@mui/material';
import AnimatedEmoji from '../../atoms/animation/AnimatedEmoji';

const CommentReactions = ({
  commentId,
  isDarkMode,
  onReactionChange,
  initialLikeCount = 0,
  initialHasReacted = false,
}) => {
  const [showReactions, setShowReactions] = useState(false);
  const [hasReacted, setHasReacted] = useState(initialHasReacted);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const likeButtonRef = useRef(null);

  useEffect(() => {
    setHasReacted(initialHasReacted);
    setLikeCount(initialLikeCount);
  }, [initialHasReacted, initialLikeCount, commentId]);

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
      const newLikeCount = response.like_count || likeCount + 1;
      setHasReacted(true);
      setLikeCount(newLikeCount);
      localStorage.setItem(`comment_reaction_${commentId}`, '😂');
      localStorage.setItem(`comment_like_count_${commentId}`, newLikeCount.toString());
    } catch (error) {
      console.error('Error while reacting to the comment:', error);
      setHasReacted(false);
      setLikeCount((prev) => Math.max(0, prev - 1));
    } finally {
      setIsLoading(false);
      setShowReactions(false);
    }
  }, [commentId, hasReacted, isLoading, likeCount]);

  const handleToggleReaction = useCallback(async () => {
    if (isLoading) return;

    setIsLoading(true);
    const prevHasReacted = hasReacted;
    const prevLikeCount = likeCount;

    try {
      if (hasReacted) {
        const response = await unlikeComment(commentId);
        const newLikeCount = response.like_count || Math.max(0, prevLikeCount - 1);
        setHasReacted(false);
        setLikeCount(newLikeCount);
        localStorage.setItem(`comment_reaction_${commentId}`, '');
        localStorage.setItem(`comment_like_count_${commentId}`, newLikeCount.toString());
      } else {
        const response = await likeComment(commentId);
        const newLikeCount = response.like_count || prevLikeCount + 1;
        setHasReacted(true);
        setLikeCount(newLikeCount);
        localStorage.setItem(`comment_reaction_${commentId}`, '😂');
        localStorage.setItem(`comment_like_count_${commentId}`, newLikeCount.toString());
      }
    } catch (error) {
      console.error('Error while toggling comment reaction:', error);
      setHasReacted(prevHasReacted);
      setLikeCount(prevLikeCount);
    } finally {
      setIsLoading(false);
    }
  }, [hasReacted, commentId, isLoading, likeCount]);

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
                    isDarkMode ? 'rgba(40, 40, 25, 0.9)' : 'rgba(245, 245, 245, 0.9)'
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
  initialLikeCount: PropTypes.number,
  initialHasReacted: PropTypes.bool,
};

export default CommentReactions;
