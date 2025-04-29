'use client';

import { useAuth } from 'hooks/useAuth';
import { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { fetchPostsByHashtag } from 'services/meme.service';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Pagination,
  Paper,
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
          <Box sx={{ maxWidth: 600, mx: 'auto' }}>
            {posts.map((post) => (
              <Paper
                key={post.id}
                sx={{
                  mb: 3,
                  overflow: 'hidden',
                  borderRadius: 2,
                  bgcolor: 'background.paper',
                }}
              >
                {/* Post header with user info */}
                <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
                  {post.user?.avatar && (
                    <Avatar
                      src={post.user.avatar}
                      alt={post.user.name}
                      sx={{ width: 40, height: 40, mr: 1.5 }}
                    />
                  )}
                  <Box>
                    <Typography variant="subtitle1">
                      {post.user?.first_name || post.user?.name || 'Unknown'}
                      {post.user?.id === user.id && ' (You)'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(post.created_at).toLocaleString()}
                    </Typography>
                  </Box>
                </Box>

                {/* Post caption */}
                {post.caption && (
                  <Box sx={{ px: 2, pb: 1 }}>
                    <Typography variant="body1">{post.caption}</Typography>
                  </Box>
                )}

                {/* Post image */}
                {post.image?.image_path && (
                  <Box
                    component="img"
                    src={post.image.image_path}
                    alt="Post image"
                    sx={{
                      width: '100%',
                      display: 'block',
                      maxHeight: 600,
                      objectFit: 'contain',
                      bgcolor: 'black',
                    }}
                  />
                )}

                {/* Post actions */}
                <Box sx={{ p: 2, display: 'flex', gap: 2 }}>
                  <Button
                    size="small"
                    startIcon={
                      <span role="img" aria-label="laugh">
                        😂
                      </span>
                    }
                  >
                    Laugh
                  </Button>
                  <Button
                    size="small"
                    startIcon={
                      <span role="img" aria-label="comment">
                        💬
                      </span>
                    }
                  >
                    Comments
                  </Button>
                  <Button
                    size="small"
                    startIcon={
                      <span role="img" aria-label="share">
                        📤
                      </span>
                    }
                  >
                    Share
                  </Button>
                </Box>
              </Paper>
            ))}
          </Box>

          {pagination.lastPage > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={pagination.lastPage}
                page={pagination.currentPage}
                onChange={(e, page) => fetchPosts(safeTag, page)}
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
