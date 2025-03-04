import React, { useState } from 'react';
import { Box, Grid, Button, TextField, Typography, IconButton, Avatar, Paper } from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import MemePost from './MemePost'; // Import the MemePost component

function MemeFeed() {
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [posts, setPosts] = useState([]); // Store posts locally

  const handleCaptionChange = (event) => {
    setCaption(event.target.value);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handlePost = () => {
    if (!caption.trim() && !imagePreview) return; // Prevent empty posts

    // Create a new post object
    const newPost = {
      id: Date.now(),
      caption,
      image: imagePreview,
      timestamp: new Date().toISOString(),
    };

    // Update the posts state
    setPosts([newPost, ...posts]);

    // Reset form
    setCaption('');
    setImage(null);
    setImagePreview(null);
  };

  return (
    <Grid container spacing={3} sx={{ p: 4 }}>
      {/* Left Side - Create a Post */}
      <Grid item xs={12} sm={4}>
        <Paper sx={{ p: 3, backgroundColor: 'white', borderRadius: '8px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar sx={{ mr: 2 }}>U</Avatar>
            <Typography variant="h6">Create a Post</Typography>
          </Box>
          <TextField
            placeholder="Write something funny..."
            variant="outlined"
            fullWidth
            multiline
            rows={3}
            value={caption}
            onChange={handleCaptionChange}
            sx={{ mb: 2 }}
          />
          {imagePreview && (
            <Box sx={{ mb: 2 }}>
              <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', borderRadius: '8px' }} />
            </Box>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <IconButton color="primary" component="label">
              <PhotoCamera />
              <input type="file" hidden accept="image/*" onChange={handleImageChange} />
            </IconButton>
            <Button variant="contained" color="primary" onClick={handlePost}>
              Post
            </Button>
          </Box>
        </Paper>
      </Grid>

      {/* Center - Display Posts */}
      <Grid item xs={12} sm={8}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 5 }}>
          {posts.length === 0 ? (
             <Typography variant="body1" color="gray" sx={{ mt: 10 }}>
              No posts yet. Be the first to share!
            </Typography>
          ) : (
            posts.map((post) => <MemePost key={post.id} {...post} />)
          )}
        </Box>
      </Grid>
    </Grid>
  );
}

export default MemeFeed;
