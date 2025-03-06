import React, { useState } from 'react';
import { useEffect } from 'react';
import { createMemePost, getMemePosts } from 'services/meme.service';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { Avatar, Box, Button, IconButton, TextField, Typography } from '@mui/material';
import MemePost from 'components/MemePost';

function MemeFeed() {
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [posts, setPosts] = useState([]);

  const handleCaptionChange = (event) => {
    setCaption(event.target.value);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handlePost = async () => {
    try {
      const formData = new FormData();
      formData.append('caption', caption);
      if (image) {
        formData.append('image', image); // Ensure it's a File object
      }
      formData.append('user_id', '1');
      const response = await createMemePost(formData);
      console.log('Post created:', response);

      setPosts([{ caption, image: imagePreview }, ...posts]);
      setCaption('');
      setImage(null);
      setImagePreview(null);
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const fetchPosts = async () => {
    try {
      const fetchedPosts = await getMemePosts(); // Calls API to fetch posts

      const updatedPosts = fetchedPosts
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .map((post) => ({
          ...post,
          image: post.image
            ? `http://memema.local/${post.image.replace('public/', 'storage/')}`
            : null, // Adjust URL
        }));
      setPosts(updatedPosts);
      setPosts(fetchedPosts); // Updates state with fetched posts
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  // Call fetchPosts when component mounts
  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <Box>
      <Box
        sx={{
          p: 2,
          backgroundColor: 'white',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
          borderRadius: '8px',
          maxWidth: '500px',
          margin: '12px auto',
          mt: 4,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ mr: 2 }}>U</Avatar>
          <Typography variant="h6" gutterBottom>
            Create a Post
          </Typography>
        </Box>
        <TextField
          placeholder="Write something funny..."
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          value={caption}
          onChange={handleCaptionChange}
          sx={{ mb: 2 }}
        />
        {imagePreview && (
          <Box sx={{ mb: 2 }}>
            <img
              src={imagePreview}
              alt="Preview"
              style={{ maxWidth: '100%', borderRadius: '8px' }}
            />
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
      </Box>
      {posts.map((post, index) => (
        <MemePost key={index} caption={post.caption} image={post.image} />
      ))}
    </Box>
  );
}

export default MemeFeed;
