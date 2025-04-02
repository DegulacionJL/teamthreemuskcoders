'use client';

import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import {
  createMemePost,
  deletePost,
  getMemePosts,
  updateImage,
  updatePost,
} from 'services/meme.service';
import { LocalFireDepartment, Star, ThumbUp, TrendingUp, Whatshot } from '@mui/icons-material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Tab,
  Tabs,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import MemeCreator from '../../../components/organisms/Image editor/meme-creator';
import { useTheme as useCustomTheme } from '../../../theme/ThemeContext';
import MemePost from './MemePost';

function MemeFeed() {
  const theme = useTheme(); // MUI theme
  const { darkMode } = useCustomTheme(); // Our custom theme context
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [currentUser, setCurrentUser] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [showMemeCreator, setShowMemeCreator] = useState(false);
  const [error, setError] = useState(null);

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
      setError('Failed to delete post. Please try again.');
    }
  };

  // Helper function to convert data URL to File
  const dataURLtoFile = (dataurl, filename) => {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
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

      // Reset page to 1 and fetch fresh posts
      setPage(1);
      setPosts([]);
      await fetchPosts(1);

      setCaption('');
      setImage(null);
      setImagePreview(null);
    } catch (error) {
      console.error('Error posting:', error);
      setError('Failed to create post. Please try again.');
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
        const response = await updateImage(postId, formData);

        const updatedImageUrl = response.data.image.image_path + `?t=${new Date().getTime()}`;
        setPosts((prevPosts) =>
          prevPosts.map((post) => (post.id === postId ? { ...post, image: updatedImageUrl } : post))
        );
      }

      // Reset page to 1 and fetch fresh posts
      setPage(1);
      setPosts([]);
      await fetchPosts(1);
    } catch (error) {
      console.error('Error updating post:', error);
      setError('Failed to update post. Please try again.');
    }
  };

  // Fetch posts from API
  const fetchPosts = async (pageNumber) => {
    setLoading(true);
    setError(null);
    try {
      console.log(`Fetching posts for page ${pageNumber}...`);
      const response = await getMemePosts(pageNumber);

      // Log the entire response to see its structure
      console.log('Full response:', response);

      // Check if the response has the expected structure
      if (!response) {
        console.error('Empty API response');
        throw new Error('Empty API response');
      }

      // Try to handle different response structures
      let postsArray = [];

      // Check for different possible response structures
      if (Array.isArray(response)) {
        // If the response itself is an array
        postsArray = response;
      } else if (response.posts && Array.isArray(response.posts)) {
        // If response has a posts property that is an array
        postsArray = response.posts;
      } else if (response.data && Array.isArray(response.data)) {
        // If response has a data property that is an array
        postsArray = response.data;
      } else if (response.data && response.data.posts && Array.isArray(response.data.posts)) {
        // If response has a data.posts property that is an array
        postsArray = response.data.posts;
      } else {
        // Log the response structure to help debug
        console.error('Could not find posts array in response:', response);
        throw new Error('Posts data is not in expected format');
      }

      console.log(`Found ${postsArray.length} posts in the response`);

      // If it's the first page, replace posts, otherwise append
      if (pageNumber === 1) {
        console.log(`Setting ${postsArray.length} posts for page 1`);
        setPosts(postsArray);
      } else {
        console.log(`Adding ${postsArray.length} posts for page ${pageNumber}`);
        setPosts((prevPosts) => {
          // Filter out any duplicates by ID
          const existingIds = new Set(prevPosts.map((post) => post.id));
          const newPosts = postsArray.filter((post) => !existingIds.has(post.id));

          return [...prevPosts, ...newPosts];
        });
      }

      // Set current user if available
      if (response.currentUser) {
        setCurrentUser(response.currentUser);
      } else if (response.data && response.data.currentUser) {
        setCurrentUser(response.data.currentUser);
      }

      // Check if we've reached the last page - handle different pagination structures
      let hasMorePages = true;

      if (response.current_page && response.last_page) {
        hasMorePages = response.current_page < response.last_page;
      } else if (response.currentPage && response.lastPage) {
        hasMorePages = response.currentPage < response.lastPage;
      } else if (response.data && response.data.current_page && response.data.last_page) {
        hasMorePages = response.data.current_page < response.data.last_page;
      } else if (response.meta && response.meta.current_page && response.meta.last_page) {
        hasMorePages = response.meta.current_page < response.meta.last_page;
      } else if (postsArray.length === 0) {
        // If we got an empty array, assume there are no more pages
        hasMorePages = false;
      }

      setHasMore(hasMorePages);

      // Log pagination info for debugging
      console.log('Pagination info:', { hasMorePages });
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Failed to load posts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(1);
  }, []);

  const loadMorePosts = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      console.log(`Loading page ${nextPage}...`);
      setPage(nextPage);

      // Fetch the next page directly instead of relying on the useEffect
      fetchPosts(nextPage)
        .then(() => {
          console.log(`Successfully loaded page ${nextPage}`);
        })
        .catch((error) => {
          console.error(`Failed to load page ${nextPage}:`, error);
          setError('Failed to load more posts. Please try again.');
        });
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Handle meme creator save
  const handleMemeCreatorSave = (editedImage, memeCaption) => {
    // Convert the data URL to a file
    const file = dataURLtoFile(editedImage, 'meme.png');
    setImage(file);
    setCaption(memeCaption);
    setImagePreview(editedImage);
    setShowMemeCreator(false);
  };

  // Sample data for UI enhancements
  const categories = [
    { id: 1, name: 'Popular Memes', icon: <LocalFireDepartment color="primary" />, active: true },
    { id: 2, name: 'Trending Now', icon: <TrendingUp />, active: false },
    { id: 3, name: 'New Arrivals', icon: <Star />, active: false },
    { id: 4, name: 'Top Picks', icon: <ThumbUp />, active: false },
  ];

  const trendingTags = [
    { id: 1, label: '#MemeMonday', color: 'primary' },
    { id: 2, label: '#GabingLagum', color: 'primary' },
    { id: 3, label: '#MlbbFunnyMoments', color: 'primary' },
    { id: 4, label: '#ProgrammerHumor', color: 'secondary' },
    { id: 5, label: '#DadJokes', color: 'success' },
  ];

  const leaderboard = [
    { id: 1, name: 'MemeKing', points: 10450, rank: 1 },
    { id: 2, name: 'FunnyGuy', points: 8230, rank: 2 },
    { id: 3, name: 'MemeLord', points: 6780, rank: 3 },
  ];

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'start',
        gap: 2,
        width: '100%',
        maxWidth: '100vw',
        margin: 'auto',
        px: 2,
        position: 'sticky',
        mx: 0,
        bgcolor: theme.palette.background.default,
        color: theme.palette.text.primary,
        transition: 'background-color 0.3s, color 0.3s',
        pt: 2,
      }}
    >
      {/* Left container */}
      <Box
        sx={{
          width: '100%',
          maxWidth: '20%',
          position: 'sticky',
          top: 0,
          height: '100vh',
          pt: 2,
          display: { xs: 'none', md: 'block' },
        }}
      >
        {/* Meme Categories */}
        <Card sx={{ mb: 3 }}>
          <CardHeader
            title="Meme Categories"
            sx={{
              bgcolor: theme.palette.mode === 'dark' ? '#4a3b6b' : theme.palette.primary.light,
              color: '#ffffff',
              py: 1.5,
            }}
          />
          <List disablePadding>
            {categories.map((category) => (
              <ListItemButton
                key={category.id}
                selected={category.active}
                sx={{
                  borderLeft: category.active ? 4 : 0,
                  borderColor: theme.palette.primary.main,
                  pl: category.active ? 2 : 3,
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>{category.icon}</ListItemIcon>
                <ListItemText
                  primary={category.name}
                  primaryTypographyProps={{
                    fontWeight: category.active ? 'medium' : 'regular',
                  }}
                />
              </ListItemButton>
            ))}
          </List>
        </Card>

        {/* Daily Challenge */}
        <Card>
          <CardHeader
            title="Daily Challenge"
            sx={{
              bgcolor: theme.palette.mode === 'dark' ? '#4a3b6b' : theme.palette.primary.light,
              color: '#ffffff',
              py: 1.5,
            }}
          />
          <CardContent>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                mb: 2,
                bgcolor: theme.palette.mode === 'dark' ? '#2a2a3a' : theme.palette.secondary.light,
                color: theme.palette.mode === 'dark' ? '#ffffff' : theme.palette.secondary.dark,
                borderRadius: 2,
              }}
            >
              <Typography variant="subtitle1" fontWeight="medium">
                Caption This!
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Create the funniest caption
              </Typography>
              <Box
                sx={{
                  height: 120,
                  bgcolor:
                    theme.palette.mode === 'dark' ? '#1e1e2e' : theme.palette.background.paper,
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 1,
                }}
              >
                <PhotoCamera sx={{ fontSize: 40, color: theme.palette.text.disabled }} />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  sx={{
                    bgcolor: '#ffb300',
                    color: '#000000',
                    '&:hover': {
                      bgcolor: '#ffa000',
                    },
                  }}
                >
                  Participate
                </Button>
              </Box>
            </Paper>
          </CardContent>
        </Card>
      </Box>

      {/* Center Content (Create Post + Posts) */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          maxWidth: { xs: '100%', md: '55%' },
          mt: 2,
        }}
      >
        {/* Create Post Section */}
        <Card sx={{ width: '100%', mb: 3, maxWidth: '80%' }}>
          <CardContent>
            {showMemeCreator ? (
              <MemeCreator
                onSave={handleMemeCreatorSave}
                onCancel={() => setShowMemeCreator(false)}
              />
            ) : (
              <>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    src={currentUser?.avatar || ''}
                    sx={{ mr: 2 }}
                    alt={`${currentUser?.first_name} ${currentUser?.last_name}`}
                  >
                    {currentUser
                      ? `${currentUser.first_name?.charAt(0) || ''}${
                          currentUser.last_name?.charAt(0) || ''
                        }`
                      : 'JD'}
                  </Avatar>
                  <Typography variant="h6">
                    {currentUser
                      ? `${currentUser.first_name} ${currentUser.last_name}`
                      : 'john degz'}
                  </Typography>
                </Box>

                <TextField
                  placeholder="Write something funny..."
                  variant="outlined"
                  multiline
                  rows={3}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  sx={{
                    width: '100%',
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      bgcolor:
                        theme.palette.mode === 'dark'
                          ? 'rgba(255,255,255,0.05)'
                          : 'rgba(0,0,0,0.02)',
                      borderRadius: 1,
                    },
                  }}
                />

                {imagePreview && (
                  <Box sx={{ mt: 2, mb: 2, textAlign: 'center' }}>
                    <img
                      src={imagePreview || '/placeholder.svg'}
                      alt="Preview"
                      style={{
                        maxWidth: '100%',
                        borderRadius: '8px',
                        display: 'block',
                        margin: 'auto',
                      }}
                    />
                  </Box>
                )}

                <Box
                  sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="outlined"
                      startIcon={<PhotoCamera />}
                      component="label"
                      sx={{ borderRadius: 4 }}
                    >
                      Upload
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setImage(e.target.files[0]);
                            setImagePreview(URL.createObjectURL(e.target.files[0]));
                          }
                        }}
                      />
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => setShowMemeCreator(true)}
                      sx={{ borderRadius: 4 }}
                    >
                      Create Meme
                    </Button>
                  </Box>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handlePost}
                    disabled={!caption && !image}
                    sx={{
                      borderRadius: 4,
                      bgcolor: '#8a4fff',
                      '&:hover': {
                        bgcolor: '#7a3fef',
                      },
                    }}
                  >
                    POST
                  </Button>
                </Box>
              </>
            )}
          </CardContent>
        </Card>

        {/* Error message */}
        {error && (
          <Box
            sx={{
              width: '100%',
              maxWidth: '80%',
              mb: 2,
              p: 2,
              bgcolor: 'error.light',
              color: 'error.dark',
              borderRadius: 1,
            }}
          >
            <Typography>{error}</Typography>
          </Box>
        )}

        {/* Meme Posts with InfiniteScroll */}
        <Box sx={{ width: '100%', maxWidth: '80%' }}>
          <InfiniteScroll
            dataLength={posts.length}
            next={loadMorePosts}
            hasMore={hasMore}
            loader={
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                <CircularProgress color="primary" />
              </Box>
            }
            endMessage={
              <Box sx={{ textAlign: 'center', my: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  You've seen all the memes! 🎉
                </Typography>
              </Box>
            }
            scrollThreshold={0.9}
            style={{ overflow: 'visible' }} // Prevent scrollbar on the component itself
          >
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
                darkMode={darkMode}
              />
            ))}
          </InfiniteScroll>
        </Box>
      </Box>

      {/* Right container */}
      <Box
        sx={{
          width: '100%',
          maxWidth: '25%',
          position: 'sticky',
          top: 0,
          height: '100vh',
          pt: 2,
          overflowY: 'auto',
          display: { xs: 'none', md: 'block' },
        }}
      >
        {/* Suggested Users */}
        <Card sx={{ mb: 3 }}>
          <CardHeader
            title="Suggested Users"
            sx={{
              bgcolor: theme.palette.mode === 'dark' ? '#4a3b6b' : theme.palette.primary.light,
              color: '#ffffff',
              py: 1.5,
            }}
          />
          <List disablePadding>
            {[1, 2, 3].map((index) => (
              <ListItem
                key={index}
                secondaryAction={
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    sx={{
                      borderRadius: 4,
                      color: '#8a4fff',
                      borderColor: '#8a4fff',
                      '&:hover': {
                        borderColor: '#7a3fef',
                        bgcolor: 'rgba(138, 79, 255, 0.08)',
                      },
                    }}
                  >
                    Follow
                  </Button>
                }
                divider
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: theme.palette.mode === 'dark' ? '#4a3b6b' : '#e0e0ff' }}>
                    U{index}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={`User ${index}`} secondary={`@user${index}`} />
              </ListItem>
            ))}
          </List>
        </Card>

        {/* Trending Tags */}
        <Card sx={{ mb: 3 }}>
          <CardHeader
            title="Trending Memes"
            sx={{
              bgcolor: theme.palette.mode === 'dark' ? '#4a3b6b' : theme.palette.primary.light,
              color: '#ffffff',
              py: 1.5,
            }}
          />
          <CardContent>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {trendingTags.map((tag) => (
                <Chip
                  key={tag.id}
                  label={tag.label}
                  color={tag.color}
                  variant="filled"
                  clickable
                  sx={{
                    bgcolor:
                      tag.color === 'primary'
                        ? '#4a3b6b'
                        : tag.color === 'secondary'
                        ? '#5d4037'
                        : '#2e7d32',
                    color: '#ffffff',
                    '&:hover': {
                      bgcolor:
                        tag.color === 'primary'
                          ? '#5a4b7b'
                          : tag.color === 'secondary'
                          ? '#6d5047'
                          : '#3e8d42',
                    },
                  }}
                />
              ))}
            </Box>
          </CardContent>
        </Card>

        {/* Leaderboard */}
        <Card>
          <CardHeader
            title="Leaderboard"
            sx={{
              bgcolor: theme.palette.mode === 'dark' ? '#4a3b6b' : theme.palette.primary.light,
              color: '#ffffff',
              py: 1.5,
            }}
          />
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth">
              <Tab label="Daily" />
              <Tab label="Weekly" />
              <Tab label="Monthly" />
            </Tabs>
          </Box>
          <List disablePadding>
            {leaderboard.map((user) => (
              <ListItem key={user.id} divider>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor:
                        user.rank === 1 ? '#ffb300' : user.rank === 2 ? 'grey.500' : '#CD7F32',
                      color: user.rank === 1 ? '#000000' : '#ffffff',
                    }}
                  >
                    {user.rank}
                  </Avatar>
                </ListItemIcon>
                <ListItemText
                  primary={user.name}
                  secondary={`${user.points.toLocaleString()} points`}
                />
                {user.rank === 1 && (
                  <Chip
                    icon={<Whatshot />}
                    label="King"
                    size="small"
                    sx={{
                      bgcolor: '#ffb300',
                      color: '#000000',
                    }}
                  />
                )}
              </ListItem>
            ))}
          </List>
        </Card>
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
