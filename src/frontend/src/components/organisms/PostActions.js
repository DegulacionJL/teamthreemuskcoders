import React, { useState } from 'react';
import { Box } from '@mui/material';
import CommentButton from 'components/atoms/CommentButton';
import ReactionButton from 'components/atoms/ReactionButton';
import CommentInput from 'components/molecules/CommentInput';

function PostActions() {
  const [count, setCount] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const [comment, setComment] = useState('');

  const handleReaction = () => {
    setCount((prev) => prev + (isActive ? -1 : 1));
    setIsActive((prev) => !prev);
  };

  const handleCommentToggle = () => {
    setShowComment((prev) => !prev);
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  // Creating Comment Post
  const handleCommentSubmit = async () => {
    if (comment.trim()) {
      try {
        const response = await axios.post('/api/comments', {
          content: comment, // assuming the backend expects 'content'
          user_id: 1, // replace with actual user ID
          post_id: 1, // replace with actual post ID
        });

        console.log('Comment submitted:', response.data);

        // Optionally update UI (e.g., re-fetch comments)
        setComment('');
      } catch (error) {
        console.error('Error submitting comment:', error.response?.data || error.message);
      }
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <ReactionButton onClick={handleReaction} count={count} isActive={isActive} />
      <CommentButton onClick={handleCommentToggle} label="💬 Comment" />

      {showComment && (
        <CommentInput
          comment={comment}
          onChange={handleCommentChange}
          onSubmit={handleCommentSubmit}
        />
      )}
    </Box>
  );
}

export default PostActions;
