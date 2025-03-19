import PropTypes from 'prop-types';
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
import { grey } from '@mui/material/colors';
import MemePost from 'components/MemePost';
import AnimatedMemeCategories from 'components/organisms/AnimatedMemeCategories';

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
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'start',
        gap: 0.5,
        width: '100%',
        maxWidth: '100vw',
        margin: 'auto',
        px: 0.5,
        border: '2px solid',
        // borderColor: 'red',
        position: 'sticky',
        mx: 0,
      }}
    >
      <Box
        sx={{
          // width: '15%',
          backgroundColor: grey[200],
          p: 1,
          marginLeft: 0,
          mt: 0,
          // border: '2px solid',
          // borderColor: 'blue',
          textAlign: 'start',
          alignItems: 'start',
          display: 'flex',
          flexDirection: 'column',
          position: 'sticky',
          width: '100%',
          maxWidth: '20%',
          height: '100vh',
        }}
      >
        <Box
          sx={{
            alignItems: 'start',
            justifyContent: 'start',
            display: 'flex',
            gap: 2,
            // border: '2px solid',
            // borderColor: 'green',
            width: '100%',
            flextDirection: 'column',
            mx: 0,
            p: 1,
            mt: 2,
            mb: 3,
            ':hover': { cursor: 'pointer' },
          }}
        >
          <Avatar
            sx={{ width: 180, height: 80, borderRadius: '5%' }}
            src={currentUser?.avatar || ''}
            alt={`${currentUser?.first_name} ${currentUser?.last_name}`}
          >
            {currentUser
              ? `${currentUser.first_name?.charAt(0) || ''}${
                  currentUser.last_name?.charAt(0) || ''
                }`
              : 'U'}
          </Avatar>
        </Box>
        <Box
          sx={{
            alignItems: 'start',
            justifyContent: 'start',
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
          }}
        >
          {/* Use the Animated Component Instead */}
          <AnimatedMemeCategories />
        </Box>
      </Box>
      {/* Center Content (Create Post + Posts) */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          maxWidth: '55%',
          mt: 2,
        }}
      >
        {/* Create Post Section */}
        <Box
          sx={{
            p: 2,
            backgroundColor: 'white',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
            borderRadius: '8px',
            width: '100%',
            maxWidth: '550px',
            mb: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
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
            multiline
            rows={1}
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            sx={{ width: '100%', maxWidth: '100%' }}
          />

          {imagePreview && (
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <img
                src={imagePreview}
                alt="Preview"
                style={{ maxWidth: '100%', borderRadius: '8px', display: 'block', margin: 'auto' }}
              />
            </Box>
          )}

          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}
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
        <Box sx={{ width: '100%' }}>
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
      </Box>
      {/* Right Sidebar */}
      <Box
        sx={{
          width: '100%',
          maxWidth: '25%',
          p: 1,
          mx: 0,
          mt: 0,
          // border: '2px solid',
          //
          borderRadius: '8px',
          textAlign: 'center',
          alignItems: 'end',
          justifyContent: 'end',
          // position: 'sticky',
          top: '80px',
          height: 'auto',
          overflowY: 'auto',
        }}
      >
        <Box
          sx={{
            backgroundImage: 'linear-gradient(to left, gray, darkgray, lightgray, lightgray)',
            borderRadius: '8px',
            p: 2,
            boxSizing: 'border-box',
          }}
        >
          <Box
            sx={{
              alignItems: 'end',
              justifyContent: 'end',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              px: 2,
              mt: 2,
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
            }}
          >
            <Typography variant="h6">Suggested Users</Typography>
            {/* Example suggested users */}
            {[1, 2, 3].map((_, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
                <Avatar sx={{ width: 40, height: 40 }}>U{index + 1}</Avatar>
                <Typography variant="body1">User {index + 1}</Typography>
                <Button variant="contained" size="small">
                  Follow
                </Button>
              </Box>
            ))}
          </Box>
          <Box
            sx={{
              alignItems: 'end',
              justifyContent: 'end',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              px: 2,
            }}
          >
            <Typography variant="h6" sx={{ mt: 4 }}>
              Trending Memes
            </Typography>
            <Typography variant="body2">#lumay</Typography>
            <Typography variant="body2">#GabiNgLagum</Typography>
            <Typography variant="body2">#MlbbFunnyMoments</Typography>

            <Typography variant="h6" sx={{ mt: 4 }}>
              Leader Board
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
MemeFeed.propTypes = {
  currentUser: PropTypes.shape({
    avatar: PropTypes.string,
    first_name: PropTypes.string,
    last_name: PropTypes.string,
  }),
};

export default MemeFeed;
