import React, { useEffect, useState } from 'react';
import {
  createMemePost,
  deletePost,
  getMemePosts,
  updateImage,
  updatePost,
} from 'services/meme.service';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { Avatar, Box, Button, IconButton, TextField, Typography } from '@mui/material';
import MemePost from 'components/MemePost';

function MemeFeed() {
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [posts, setPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  // State for menu handling
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const open = Boolean(anchorEl);

  // Open menu
  const handleMenuOpen = (event, postId) => {
    setAnchorEl(event.currentTarget);
    setSelectedPostId(postId);
  };

  // Close menu
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPostId(null);
  };

  // Handle delete post
  const handleDelete = async (postId) => {
    try {
      await deletePost(postId);
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
      handleMenuClose();
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  // Handle new post creation
  const handlePost = async () => {
    try {
      const formData = new FormData();
      formData.append('caption', caption);
      formData.append('image', image);
      formData.append('user_id', '1');

      const response = await createMemePost(formData);

      if (!response || !response.data || !response.data.id) {
        throw new Error('Failed to create post');
      }

      // Extract image URL from response
      const newImageUrl = response.data.image; // Make sure backend sends full URL

      setPosts((prevPosts) => [response.data, ...prevPosts]);

      console.log('Before reset:', caption, image, imagePreview);

      // Reset caption & image, but keep the preview updated
      setCaption('');
      setImage(null);
      setImagePreview(newImageUrl); // Update preview to show new image
    } catch (error) {
      console.error('Error posting:', error);
    }
  };

  const handleUpdatePost = async (postId, newCaption, newImage) => {
    try {
      console.log('Updating post:', { postId, newCaption, newImage });

      if (newCaption) {
        await updatePost(postId, { caption: newCaption });
      }

      if (newImage) {
        const formData = new FormData();
        formData.append('image', newImage);
        await updateImage(postId, formData);
      }

      fetchPosts();
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  // Fetch posts from API
  const fetchPosts = async () => {
    try {
      const response = await getMemePosts();
      if (!response || !Array.isArray(response.posts))
        throw new Error('Fetched posts is not an array!');

      setPosts(response.posts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));

      if (response.currentUser) {
        setCurrentUser(response.currentUser);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <Box>
      {/* Create Post Section */}
      <Box
        sx={{
          p: 2,
          backgroundColor: 'white',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
          borderRadius: '8px',
          maxWidth: '550px',
          margin: '12px auto',
          mt: 4,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, fontSize: '10px' }}>
          <Avatar
            src={currentUser?.avatar || ''}
            sx={{ mr: 2 }}
            alt={`${currentUser?.first_name} ${currentUser?.last_name}`}
          >
            {currentUser
              ? `${currentUser.first_name?.charAt(0) || ''}${
                  currentUser.last_name?.charAt(0) || ''
                }`
              : 'U'}
          </Avatar>
          <Typography variant="h6">
            {currentUser ? `${currentUser.first_name} ${currentUser.last_name}` : 'Unknown User'}
          </Typography>
        </Box>
        <TextField
          placeholder="Write something funny..."
          variant="outlined"
          fullWidth
          multiline
          rows={1}
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          sx={{ mb: 2, height: '20px' }}
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
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: '25px',
          }}
        >
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

      {/* Meme Posts */}
      {posts.map((post) => (
        <MemePost
          key={post.id}
          id={post.id}
          caption={post.caption}
          image={post.image ? post.image.image_path : null}
          timestamp={post.created_at}
          user={post.user}
          onDelete={handleDelete}
          onUpdate={handleUpdatePost}
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
