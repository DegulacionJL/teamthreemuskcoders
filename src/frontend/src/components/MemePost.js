import React from 'react';
import createMemePost from 'services/meme.service';
import { Avatar, Box, Typography } from '@mui/material';

function MemePost({ caption, image }) {
  return (
    <Box
      sx={{
        p: 2,
        backgroundColor: 'white',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
        maxWidth: '500px',
        margin: 'auto',
        mt: 4,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Avatar sx={{ mr: 2 }}>U</Avatar>
        <Typography variant="h6" gutterBottom>
          User
        </Typography>
      </Box>
      <Typography variant="body1" sx={{ mb: 2 }}>
        {caption}
      </Typography>
      {image && (
        <Box sx={{ mb: 2 }}>
          <img src={image} alt="Meme" style={{ maxWidth: '100%', borderRadius: '8px' }} />
        </Box>
      )}
    </Box>
  );
}

export default MemePost;
