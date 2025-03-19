import PropTypes from 'prop-types';
import React from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Box, IconButton, Stack, Typography } from '@mui/material';

function CommentItem({ comment, onEdit, onDelete, currentUser }) {
  const isOwner = currentUser && comment.user && currentUser.id === comment.user.id;

  return (
    <Box sx={{ py: 1, borderBottom: '1px solid #f0f0f0' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
        <Box>
          <Typography variant="subtitle2" component="span" sx={{ fontWeight: 'bold' }}>
            {comment.user ? comment.user.full_name : 'Unknown User'}
          </Typography>
          <Typography variant="body2" component="span" sx={{ ml: 1, color: 'text.secondary' }}>
            {comment.timestamp}
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.5 }}>
            {comment.text}
          </Typography>

          {comment.image && (
            <Box sx={{ mt: 1, mb: 1 }}>
              <img
                src={comment.image}
                alt="Comment attachment"
                style={{
                  maxWidth: '100%',
                  maxHeight: '200px',
                  borderRadius: '4px',
                }}
              />
            </Box>
          )}
        </Box>

        {isOwner && (
          <Box>
            <IconButton
              size="small"
              onClick={() => onEdit(comment.id, comment.text, comment.image)}
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={() => onDelete(comment.id)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        )}
      </Stack>
    </Box>
  );
}

CommentItem.propTypes = {
  comment: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    text: PropTypes.string.isRequired,
    image: PropTypes.string,
    timestamp: PropTypes.string.isRequired,
    user: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      full_name: PropTypes.string.isRequired,
    }),
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  currentUser: PropTypes.object,
};

export default CommentItem;
