import React, { useState } from 'react';
import { Box, Typography, Avatar, TextField, Button, IconButton } from '@mui/material';

const Comment = ({ comment, level = 0 }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [localReplyText, setLocalReplyText] = useState('');

  const handleReply = async () => {
    if (!localReplyText.trim()) return;

    try {
      await addComment(id, localReplyText, null, comment.id);
      await fetchComments(); // Refresh comments
      setLocalReplyText('');
      setShowReplyForm(false);
    } catch (error) {
      console.error('Error adding reply:', error);
    }
  };

  return (
    <Box sx={{ ml: level * 4 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          mt: 2,
          pb: 2,
          borderBottom: '1px solid #eee',
        }}
      >
        <Avatar
          src={comment.user?.avatar || ''}
          sx={{ mr: 1 }}
          alt={comment.user?.full_name || 'User'}
        >
          {getInitials(comment.user?.first_name, comment.user?.last_name)}
        </Avatar>
        <Box sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
              {comment.user?.full_name || 'Unknown User'}
            </Typography>
            <Typography variant="caption" color="gray">
              {comment.timestamp || comment.created_at}
            </Typography>
          </Box>

          {editingCommentId === comment.id ? (
            <>
              <TextField
                fullWidth
                size="small"
                value={editingCommentText}
                onChange={(e) => setEditingCommentText(e.target.value)}
                sx={{ mt: 1 }}
              />
              {comment.image && (
                <Box sx={{ mt: 1 }}>
                  <img
                    src={comment.image}
                    alt="Comment attachment"
                    style={{ maxHeight: '200px', borderRadius: '4px', maxWidth: '100%' }}
                  />
                </Box>
              )}
            </>
          ) : (
            <>
              {comment.text && (
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  {comment.text}
                </Typography>
              )}
              {comment.image && (
                <Box sx={{ mt: 1 }}>
                  <img
                    src={comment.image}
                    alt="Comment attachment"
                    style={{ maxHeight: '200px', borderRadius: '4px', maxWidth: '100%' }}
                  />
                </Box>
              )}
              <Box sx={{ mt: 1 }}>
                <Button
                  size="small"
                  onClick={() => setShowReplyForm(!showReplyForm)}
                  sx={{ mr: 1, textTransform: 'none' }}
                >
                  Reply
                </Button>
              </Box>

              {showReplyForm && (
                <Box sx={{ display: 'flex', mt: 1, mb: 1 }}>
                  <TextField
                    size="small"
                    placeholder="Write a reply..."
                    fullWidth
                    value={localReplyText}
                    onChange={(e) => setLocalReplyText(e.target.value)}
                  />
                  <Button variant="contained" size="small" onClick={handleReply} sx={{ ml: 1 }}>
                    Reply
                  </Button>
                </Box>
              )}
            </>
          )}
        </Box>
        <Box>
          <IconButton
            size="small"
            onClick={() => {
              setEditingCommentId(comment.id);
              setEditingCommentText(comment.text);
              setIsUpdateModalOpen(true);
              setUpdateCommentImagePreview(comment.image);
            }}
          >
            ✏️
          </IconButton>
          <IconButton size="small" onClick={() => confirmDeleteComment(comment.id)}>
            🗑️
          </IconButton>
        </Box>
      </Box>

      {/* Render replies */}
      {comment.replies && comment.replies.length > 0 && (
        <Box sx={{ ml: 4 }}>
          {comment.replies.map((reply) => (
            <Comment key={reply.id} comment={reply} level={level + 1} />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default Comment;
