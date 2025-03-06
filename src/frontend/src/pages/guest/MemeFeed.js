import React, { useEffect, useState } from 'react';
import { createMemePost, getMemePosts } from 'services/meme.service';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { Avatar, Box, Button, IconButton, TextField, Typography } from '@mui/material';
import MemePost from 'components/MemePost';

function MemeFeed() {
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [posts, setPosts] = useState([]);

  // State to track menu anchor (for post options)
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPostId, setSelectedPostId] = useState(null);

  const open = Boolean(anchorEl);

  // Handle menu open (pass post ID)
  const handleMenuOpen = (event, postId) => {
    setAnchorEl(event.currentTarget);
    setSelectedPostId(postId);
  };

  // Handle menu close
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPostId(null);
  };

  const handleDelete = (id) => {
    setPosts(posts.filter((post) => post.id !== id)); // Remove the post from the state
    handleMenuClose();
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

      setPosts([
        { caption, image: imagePreview, id: Date.now(), created_at: new Date().toISOString() },
        ...posts,
      ]);
      setCaption('');
      setImage(null);
      setImagePreview(null);

      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const fetchPosts = async () => {
    try {
      const fetchedPosts = await getMemePosts();

      const updatedPosts = fetchedPosts
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .map((post) => ({
          ...post,
          image: post.image
            ? `http://memema.local/${post.image.replace('public/', 'storage/')}`
            : null,
        }));
      setPosts(updatedPosts);
      setPosts(fetchedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

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
          onChange={(e) => setCaption(e.target.value)}
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
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={(e) => {
                setImage(e.target.files[0]);
                setImagePreview(URL.createObjectURL(e.target.files[0]));
              }}
            />
          </IconButton>
          <Button variant="contained" color="primary" onClick={handlePost}>
            Post
          </Button>
        </Box>
      </Box>

      {/* Pass handleMenuOpen and handleMenuClose to MemePost */}
      {posts.map((post) => (
        <MemePost
          key={post.id}
          id={post.id}
          caption={post.caption}
          image={post.image}
          timestamp={post.created_at}
          onDelete={handleDelete}
          onMenuOpen={handleMenuOpen}
          onMenuClose={handleMenuClose}
          menuAnchor={anchorEl}
          selectedPostId={selectedPostId}
          isMenuOpen={open && selectedPostId === post.id}
        />
      ))}
    </Box>
  );
}

export default MemeFeed;
