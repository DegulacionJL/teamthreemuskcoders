import { useAuth } from 'hooks/useAuth';
import { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { fetchPostsByHashtag } from 'services/meme.service';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Grid,
  Pagination,
  Snackbar,
  Typography,
} from '@mui/material';

const HashtagPage = () => {
  const { user, isLoading: authLoading } = useAuth({ middleware: 'auth' });
  const { tag } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    total: 0,
  });

  const safeTag = tag?.trim() || '';

  const fetchPosts = async (tagArg, page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchPostsByHashtag(tagArg, page);
      setPosts(response.posts || []);
      setPagination({
        currentPage: response.meta?.current_page || 1,
        lastPage: response.meta?.last_page || 1,
        total: response.meta?.total || 0,
      });
    } catch (err) {
      setError(`Failed to load posts: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('Tag: ', tag);
    console.log('Safe Tag: ', safeTag);
    if (tag && tag.trim()) {
      fetchPosts(tag.trim());
    }
  }, [safeTag, tag]);

  if (authLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4 }}>
        <CircularProgress />
        <Typography variant="body2" sx={{ ml: 2 }}>
          Verifying your login...
        </Typography>
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: `/hashtag/${safeTag}` }} replace />;
  }

  return (
    <Box sx={{ p: 4 }}>
      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Posts with hashtag
        </Typography>
        <Chip
          label={`#${safeTag}`}
          color="primary"
          sx={{ ml: 2, fontSize: '1.2rem', height: 32 }}
        />
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" color="text.secondary">
          Welcome, {user.name || user.first_name || 'User'}!
          {pagination.total > 0 &&
            ` Viewing ${pagination.total} post${
              pagination.total !== 1 ? 's' : ''
            } with #${safeTag}`}
        </Typography>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4 }}>
          <CircularProgress />
          <Typography variant="body2" sx={{ ml: 2 }}>
            Loading posts with #{safeTag}...
          </Typography>
        </Box>
      ) : posts.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No posts found with hashtag #{safeTag}.
          </Typography>
          <Button variant="contained" color="primary" sx={{ mt: 3 }} href="/create-post">
            Create the first post with #{safeTag}
          </Button>
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {posts.map((post) => (
              <Grid item xs={12} sm={6} md={4} key={post.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  {post.image?.image_path && (
                    <CardMedia
                      component="img"
                      image={post.image.image_path}
                      alt="Post image"
                      sx={{ height: 200, objectFit: 'cover' }}
                    />
                  )}
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="body1" gutterBottom>
                      {post.caption}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                      {post.user?.avatar && (
                        <Avatar
                          src={post.user.avatar}
                          alt={post.user.name}
                          sx={{ width: 32, height: 32, mr: 1 }}
                        />
                      )}
                      <Typography variant="body2" color="text.secondary">
                        Posted by: {post.user?.first_name || post.user?.name || 'Unknown'}
                        {post.user?.id === user.id && ' (You)'}
                      </Typography>
                    </Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                      sx={{ mt: 1 }}
                    >
                      {new Date(post.created_at).toLocaleString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {pagination.lastPage > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={pagination.lastPage}
                page={pagination.currentPage}
                onChange={(e, page) => fetchPosts(page)}
                color="primary"
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default HashtagPage;
