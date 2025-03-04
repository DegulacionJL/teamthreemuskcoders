import React, { useState } from 'react';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions'; // "Haha" emoji icon
import { Box, IconButton, Typography } from '@mui/material';


function ReactionButton() {
  const [count, setCount] = useState(0);
  const [reacted, setReacted] = useState(false);

  const handleReaction = () => {
    if (reacted) {
      setCount(count - 1);
    } else {
      setCount(count + 1);
    }
    setReacted(!reacted);
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <IconButton color={reacted ? 'primary' : 'default'} onClick={handleReaction}>
        <EmojiEmotionsIcon />
      </IconButton>
      <Typography variant="body2" sx={{ ml: 1 }}>
        {count}
      </Typography>
    </Box>
  );
}

export default ReactionButton;
