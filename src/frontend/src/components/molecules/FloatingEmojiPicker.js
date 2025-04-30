import { autoUpdate, flip, offset, shift, useFloating } from '@floating-ui/react';
import EmojiPicker from 'emoji-picker-react';
import PropTypes from 'prop-types';
import React from 'react';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import { Box, IconButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const FloatingEmojiPicker = ({
  onEmojiClick,
  showEmojiPicker,
  setShowEmojiPicker,
  emojiButtonRef,
}) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  const { refs, floatingStyles } = useFloating({
    open: showEmojiPicker,
    placement: 'bottom-end',
    middleware: [offset(12), flip(), shift({ padding: 12 })],
    whileElementsMounted: autoUpdate,
    elements: { reference: emojiButtonRef.current },
  });

  return (
    <>
      <IconButton
        ref={emojiButtonRef}
        onClick={() => setShowEmojiPicker((prev) => !prev)}
        edge="end"
      >
        <EmojiEmotionsIcon />
      </IconButton>
      {showEmojiPicker && (
        <Box
          ref={refs.setFloating}
          style={{ ...floatingStyles, zIndex: 1500, position: 'absolute' }}
          sx={{
            '& .emoji-picker-react': {
              backgroundColor: isDarkMode ? '#1a2235' : '#ffffff',
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
              borderRadius: 8,
              overflow: 'visible',
            },
          }}
        >
          <EmojiPicker onEmojiClick={onEmojiClick} theme={isDarkMode ? 'dark' : 'light'} />
        </Box>
      )}
    </>
  );
};

FloatingEmojiPicker.propTypes = {
  onEmojiClick: PropTypes.func.isRequired,
  showEmojiPicker: PropTypes.bool.isRequired,
  setShowEmojiPicker: PropTypes.func.isRequired,
  emojiButtonRef: PropTypes.object.isRequired,
};

export default FloatingEmojiPicker;
