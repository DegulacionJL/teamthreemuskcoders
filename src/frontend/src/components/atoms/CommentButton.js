import PropTypes from 'prop-types';
import React from 'react';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { IconButton, Tooltip } from '@mui/material';

function CommentButton({ onClick }) {
  return (
    <Tooltip title="Comment">
      <IconButton onClick={onClick} color="primary">
        <ChatBubbleOutlineIcon />
      </IconButton>
    </Tooltip>
  );
}

CommentButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default CommentButton;
