import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
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
import MemePost from '../../components/MemePost';
import { useTheme as useCustomTheme } from '../../theme/ThemeContext';

function MemeFeed() {
  const theme = useTheme(); // MUI theme
  const { darkMode } = useCustomTheme(); // Our custom theme context
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [posts, setPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [tabValue, setTabValue] = useState(0);

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

      // Fetch updated posts from backend after posting
      await fetchPosts();

      setCaption('');
      setImage(null);
      setImagePreview(null);
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
        const response = await updateImage(postId, formData);

        const updatedImageUrl = response.data.image.image_path + `?t=${new Date().getTime()}`;
        setPosts((prevPosts) =>
          prevPosts.map((post) => (post.id === postId ? { ...post, image: updatedImageUrl } : post))
        );
      }

      await fetchPosts();
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  // Fetch posts from API
  const fetchPosts = async () => {
    try {
      const response = await getMemePosts();
      console.log(response);
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

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
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

  console.log(posts);

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
      {/* Left Sidebar */}
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
                {currentUser ? `${currentUser.first_name} ${currentUser.last_name}` : 'john degz'}
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
                    theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
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

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
          </CardContent>
        </Card>

        {/* Meme Posts */}
        <Box sx={{ width: '100%', maxWidth: '80%' }}>
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
        </Box>
      </Box>

      {/* Right Sidebar */}
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
