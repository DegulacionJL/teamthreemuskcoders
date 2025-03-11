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
import EditPostModal from 'components/organisms/EditPostModal';

function MemeFeed() {
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [posts, setPosts] = useState([]);

  // State for Edit Post Modal
  const [editPostId, setEditPostId] = useState(null);
  const [editCaption, setEditCaption] = useState('');
  const [editImage, setEditImage] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

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

  // Open edit modal with post details
  const handleEditClick = (id, currentCaption, currentImage) => {
    setEditPostId(id);
    setEditCaption(currentCaption);
    setEditImage(currentImage);
    setEditModalOpen(true);
  };

  // Close edit modal
  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setEditPostId(null);
    setEditCaption('');
    setEditImage(null);
  };

  // Handle update after editing
  const handleUpdateCaption = async (updatedCaption) => {
    if (!editPostId) return;

    try {
      // Call the API to update the post
      const data = {
        caption: updatedCaption,
      };

      const updatedPost = await updatePost(editPostId, data);

      // Update the state locally with the updated post
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === editPostId ? { ...post, caption: updatedPost.caption } : post
        )
      );

      // Close modal after update
      handleCloseEditModal();
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const handleUpdateImage = async (updatedImage) => {
    if (!editPostId || !(updatedImage instanceof File)) return;

    const formData = new FormData();
    formData.append('image', updatedImage); // Append the File

    const updatedPost = await updateImage(editPostId, formData); // Send FormData directly

    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === editPostId ? { ...post, image: updatedPost.image } : post
      )
    );

    handleCloseEditModal();
  };

  // const convertFileToBase64 = (file) => {
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.readAsDataURL(file);
  //     reader.onload = () => resolve(reader.result);
  //     reader.onerror = (error) => reject(error);
  //   });
  // };

  const handleSave = async (updatedCaption, updatedImage) => {
    if (!editPostId) return;

    try {
      if (updatedCaption !== editCaption) {
        await handleUpdateCaption(updatedCaption); // Update caption
      }
      if (updatedImage instanceof File) {
        await handleUpdateImage(updatedImage); // Update image only if changed
      }
    } catch (error) {
      console.error('Error updating post:', error);
    }
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
      if (image) formData.append('image', image);
      formData.append('user_id', '1');

      const response = await createMemePost(formData);

      if (!response || !response.data || !response.data.id) {
        throw new Error('Failed to create post');
      }

      setPosts((prevPosts) => [response.data, ...prevPosts]);
      console.log('Before reset:', caption, image, imagePreview);

      setCaption('');
      setImage(null);
      setImagePreview(null);

      setTimeout(() => {
        console.log('After reset:', caption, image, imagePreview);
      }, 0);

      fetchPosts();
    } catch (error) {
      // console.error('Error creating post:', error);
      console.log('After reset:', caption, image, imagePreview);
    }
  };

  // Fetch posts from API
  const fetchPosts = async () => {
    try {
      const response = await getMemePosts();
      if (!response || !Array.isArray(response.posts))
        throw new Error('Fetched posts is not an array!');

      setPosts(response.posts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
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

      {/* Meme Posts */}
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

      {/* Edit Post Modal */}
      <EditPostModal
        open={editModalOpen}
        onClose={handleCloseEditModal}
        currentCaption={editCaption}
        currentImage={editImage}
        onSave={handleSave}
      />
    </Box>
  );
}

export default MemeFeed;
