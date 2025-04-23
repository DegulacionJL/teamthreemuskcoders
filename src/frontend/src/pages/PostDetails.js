import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPostById } from 'services/meme.service';
// Add this function in your service file
import { Box, CircularProgress, Typography } from '@mui/material';

const PostDetails = () => {
  const { postId } = useParams(); // Get the postId from the URL
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await getPostById(postId); // Fetch the post data
        setPost(response.data);
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!post) {
    return (
      <Typography variant="h6" color="text.secondary" textAlign="center">
        Post not found.
      </Typography>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        {post.caption}
      </Typography>
      {post.image && (
        <img
          src={post.image}
          alt="Post"
          style={{ maxWidth: '100%', borderRadius: '8px', marginTop: '16px' }}
        />
      )}
      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        Posted by: {post.user?.first_name} {post.user?.last_name}
      </Typography>
    </Box>
  );
};

export default PostDetails;
