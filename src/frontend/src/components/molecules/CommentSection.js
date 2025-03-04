import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Avatar, IconButton } from '@mui/material';
import CommentIcon from '@mui/icons-material/Comment';

function CommentSection() {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);

  const handleCommentChange = (event) => {
    setCommentText(event.target.value);
  };

  const handleAddComment = () => {
    if (!commentText.trim()) return;

    const newComment = {
      id: Date.now(),
      text: commentText,
      user: {
        name: 'John Doe', // Replace with logged-in user data
        avatar: '/default-avatar.png', // Replace with real user avatar
      },
    };

    setComments([...comments, newComment]);
    setCommentText('');
  };

  return (
    <Box sx={{ mt: 2 }}>
      <IconButton onClick={() => setShowComments(!showComments)}>
        <CommentIcon />
      </IconButton>

      {showComments && (
        <Box sx={{ mt: 2 }}>
          {/* Comment Input */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar sx={{ mr: 2 }} src="/default-avatar.png">J</Avatar>
            <TextField
              fullWidth
              size="small"
              placeholder="Write a comment..."
              value={commentText}
              onChange={handleCommentChange}
              sx={{ mr: 1 }}
            />
            <Button variant="contained" color="primary" onClick={handleAddComment}>
              Post
            </Button>
          </Box>

          {/* Display Comments */}
          {comments.map((comment) => (
            <Box key={comment.id} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Avatar sx={{ mr: 2 }} src={comment.user.avatar}>
                {comment.user.name.charAt(0)}
              </Avatar>
              <Typography variant="body2">
                <strong>{comment.user.name}</strong>: {comment.text}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}

export default CommentSection;
