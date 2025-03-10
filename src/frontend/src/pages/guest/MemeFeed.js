import React, { useEffect, useState } from 'react';
import { createMemePost, deletePost, getMemePosts, updatePost } from 'services/meme.service';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { Avatar, Box, Button, IconButton, TextField, Typography } from '@mui/material';
import MemePost from 'components/MemePost';

function MemeFeed() {
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [posts, setPosts] = useState([]);
  const [editPostId, setEditPostId] = useState(null);
  const [editCaption, setEditCaption] = useState('');
  const [editImage, setEditImage] = useState(null);

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

  const handleEditClick = (id, currentCaption, currentImage) => {
    setEditPostId(id);
    setEditCaption(currentCaption);
    setImagePreview(currentImage);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setEditImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleUpdate = async () => {
    if (!editPostId) return;

    try {
      const formData = new FormData();
      formData.append('caption', editCaption);
      if (editImage) {
        formData.append('image', editImage);
      }

      const updatedPost = await updatePost(editPostId, formData);

      setPosts(
        posts.map((post) =>
          post.id === editPostId
            ? { ...post, caption: updatedPost.caption, image: updatedPost.image }
            : post
        )
      );

      setEditPostId(null);
      setEditCaption('');
      setEditImage(null);
      setImagePreview(null);
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const handleDelete = async (postId) => {
    try {
      await deletePost(postId);
      console.log('Post deleted:', postId);

      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));

      handleMenuClose();
    } catch (error) {
      console.error('Error deleting post:', error);
    }
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
      const response = await getMemePosts();

      // Ensure response is an object and has posts array
      if (!response || !Array.isArray(response.posts)) {
        throw new Error('Fetched posts is not an array!');
      }

      const updatedPosts = response.posts.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      setPosts(updatedPosts);
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
          onUpdate={handleEditClick}
          onMenuOpen={handleMenuOpen}
          onMenuClose={handleMenuClose}
          menuAnchor={anchorEl}
          selectedPostId={selectedPostId}
          isMenuOpen={open && selectedPostId === post.id}
        />
      ))}
      {/* 🟢 Edit Modal or Input Fields */}
      {editPostId && (
        <Box className="edit-modal">
          <input
            type="text"
            value={editCaption}
            onChange={(e) => setEditCaption(e.target.value)}
            placeholder="Edit caption"
          />
          <input type="file" onChange={handleImageChange} />
          {imagePreview && <img src={imagePreview} alt="Preview" width="100" />}
          <button onClick={handleUpdate}>Save Changes</button>
          <button onClick={() => setEditPostId(null)}>Cancel</button>
        </Box>
      )}
    </Box>
  );
}

export default MemeFeed;
