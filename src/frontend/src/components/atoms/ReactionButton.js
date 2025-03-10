import PropTypes from 'prop-types';
import React from 'react';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import { IconButton } from '@mui/material';

// ✅ Atom: ReactionButton
function ReactionButton({ onClick, count, isActive }) {
  return (
    <IconButton onClick={onClick} color={isActive ? 'primary' : 'default'}>
      <EmojiEmotionsIcon /> {count > 0 && <span>{count}</span>}
    </IconButton>
  );
}

ReactionButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  count: PropTypes.number.isRequired,
  isActive: PropTypes.bool.isRequired,
};

export default ReactionButton;
