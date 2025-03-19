import PropTypes from 'prop-types';
import React, { useState } from 'react';
// Add this import
import { Box, Button, IconButton, TextField, Typography } from '@mui/material';
import AvatarWithInitials from '../atoms/AvatarWithInitials';

const CommentItem = ({ comment, onEditComment, onDeleteComment }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingText, setEditingText] = useState(comment.text);

  const handleSave = () => {
    onEditComment(comment.id, editingText);
    setIsEditing(false);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        mt: 2,
        pb: 2,
        borderBottom: '1px solid #eee',
      }}
    >
      <AvatarWithInitials
        src={comment.user?.avatar}
        firstName={comment.user?.first_name}
        lastName={comment.user?.last_name}
        alt={comment.user?.full_name}
      />
      <Box sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
            {comment.user?.full_name || 'Unknown User'}
          </Typography>
          <Typography variant="caption" color="gray">
            {comment.timestamp || comment.created_at}
          </Typography>
        </Box>
        {isEditing ? (
          <TextField
            fullWidth
            size="small"
            value={editingText}
            onChange={(e) => setEditingText(e.target.value)}
            sx={{ mt: 1 }}
          />
        ) : (
          <Typography variant="body2" sx={{ mt: 0.5 }}>
            {comment.text}
          </Typography>
        )}
      </Box>
      {isEditing ? (
        <Button size="small" onClick={handleSave}>
          Save
        </Button>
      ) : (
        <Box>
          <IconButton size="small" onClick={() => setIsEditing(true)}>
            ✏️
          </IconButton>
          <IconButton size="small" onClick={() => onDeleteComment(comment.id)}>
            🗑️
          </IconButton>
        </Box>
      )}
    </Box>
  );
};

CommentItem.propTypes = {
  comment: PropTypes.object.isRequired,
  onEditComment: PropTypes.func.isRequired,
  onDeleteComment: PropTypes.func.isRequired,
};

export default CommentItem;
