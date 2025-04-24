import { useAuth } from 'hooks/useAuth';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { followUser } from 'services/follow.service';
import { getSuggestedUsers, getTrendingMemes } from 'services/user.service';
import { Whatshot } from '@mui/icons-material';
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
  ListItemText,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material';

const RightContent = ({
  leaderboard,
  leaderboardLoading,
  leaderboardError,
  tabValue,
  handleTabChange,
  handleUserNameClick,
}) => {
  const { user } = useAuth({ middleware: 'auth' });
  const theme = useTheme();
  const navigate = useNavigate();

  // State for Suggested User
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [loadingSuggestedUsers, setLoadingSuggestedUsers] = useState(true);
  // const [followStates, setFollowStates] = useState({});
  const { currentUserId } = useAuth();

  // State for Trending Hashtags
  const [trendingHashtags, setTrendingHashtags] = useState([]);
  const [loadingTrendingHashtags, setLoadingTrendingHashtags] = useState(true);

  // Fetch Suggested Users
  const fetchSuggestedUsers = async () => {
    const listSuggestedUsers = await getSuggestedUsers(user.id);
    if (!listSuggestedUsers) {
      setLoadingSuggestedUsers(true);
    }
    setLoadingSuggestedUsers(false);
    setSuggestedUsers(listSuggestedUsers);
    // console.log('Suggested users:', listSuggestedUsers);

    // try {
    //   console.log('Fetching suggested users...');
    //   const token = localStorage.getItem('access_token');
    //   console.log('Auth token available:', !!token);
    //   const users = await getSuggestedUsers(user.id);
    //   console.log('Suggested users response:', users);
    //   setSuggestedUsers(users || []); // Fallback to an empty array
    // } catch (error) {
    //   console.error('Error fetching suggested users:', error);
    //   // Log more details about the error
    //   if (error.response) {
    //     console.error('Error response:', error.response.data);
    //     console.error('Error status:', error.response.status);
    //   }
    // } finally {
    //   setLoadingSuggestedUsers(false);
    // }
  };

  useEffect(() => {
    // console.log('user', user);
    fetchSuggestedUsers();
  }, [user]);

  // Fetch Trending Hashtags
  useEffect(() => {
    const fetchTrendingHashtags = async () => {
      try {
        const hashtags = await getTrendingMemes();
        setTrendingHashtags(hashtags || []); // Fallback to an empty array
      } catch (error) {
        console.error('Error fetching trending hashtags:', error);
      } finally {
        setLoadingTrendingHashtags(false);
      }
    };

    fetchTrendingHashtags();
  }, []);

  const handleHashtagClick = (postId) => {
    navigate(`/posts/${postId}`); // Redirect to the specific post
  };

  const handleFollowUser = async (userId) => {
    try {
      await followUser(userId);
      setSuggestedUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));

      const currentUser = JSON.parse(localStorage.getItem('user'));
      const currentUserId = currentUser?.id;

      const newSuggestions = await getSuggestedUsers(currentUserId);
      const currentUserIds = suggestedUsers.map((u) => u.id);

      const newUser = newSuggestions.find((u) => !currentUserIds.includes(u.id) && u.id !== userId);
      if (newUser) {
        setSuggestedUsers((prevUsers) => [...prevUsers, newUser]);
      }
    } catch (error) {
      console.error('Follow error: ', error);
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '25%',
        position: 'sticky',
        top: '16px',
        maxHeight: 'calc(100vh - 32px)',
        overflowY: 'auto',
        pt: 2,
        pb: 2,
        display: { xs: 'none', md: 'block' },
        '&::-webkit-scrollbar': {
          width: '6px',
        },
        '&::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
          background: 'rgba(138, 79, 255, 0.3)',
          borderRadius: '6px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          background: 'rgba(138, 79, 255, 0.5)',
        },
      }}
    >
      {/* Suggested Users Section */}
      <Card sx={{ mb: 3 }}>
        <CardHeader
          title="Suggested Users"
          sx={{
            bgcolor: theme.palette.mode === 'dark' ? '#4a3b6b' : theme.palette.primary.light,
            color: '#ffffff',
            py: 1.5,
          }}
        />
        {loadingSuggestedUsers ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress size={24} />
          </Box>
        ) : suggestedUsers.length === 0 ? (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              No suggested users available.
            </Typography>
          </Box>
        ) : (
          <List disablePadding>
            {suggestedUsers.map((suggestedUser) => (
              <ListItem
                key={suggestedUser.id}
                secondaryAction={
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={() => handleFollowUser(suggestedUser.id)}
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
                  {/* <Avatar
                    src={user.avatar}
                    sx={{ bgcolor: theme.palette.mode === 'dark' ? '#4a3b6b' : '#e0e0ff' }}
                  > */}
                  {suggestedUser.first_name?.[0] || suggestedUser.last_name?.[0] || 'U'}
                  {/* </Avatar> */}
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography
                      sx={{
                        cursor: 'pointer',
                        '&:hover': {
                          textDecoration: 'underline',
                          color: theme.palette.primary.main,
                        },
                      }}
                      onClick={(e) => handleUserNameClick(e, suggestedUser.id)}
                    >
                      {`${suggestedUser.first_name} ${suggestedUser.last_name}`}
                    </Typography>
                  }
                  secondary={`@${suggestedUser.username}`}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Card>

      {/* Trending Hashtags Section */}
      <Card sx={{ mb: 3 }}>
        <CardHeader
          title="Trending Hashtags"
          sx={{
            bgcolor: theme.palette.mode === 'dark' ? '#4a3b6b' : theme.palette.primary.light,
            color: '#ffffff',
            py: 1.5,
          }}
        />
        <CardContent>
          {loadingTrendingHashtags ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
              <CircularProgress size={24} />
            </Box>
          ) : trendingHashtags.length === 0 ? (
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary" textAlign="center">
                No trending memes available.
              </Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {trendingHashtags.map((hashtag) => (
                <Chip
                  key={hashtag.hashtag}
                  label={hashtag.hashtag}
                  clickable
                  onClick={() => handleHashtagClick(hashtag.post_id)}
                  sx={{
                    bgcolor: 'primary.main',
                    color: '#ffffff',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    },
                  }}
                />
              ))}
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Leaderboard Section */}
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
        {leaderboardLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress size={24} />
          </Box>
        ) : leaderboardError ? (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography color="error">{leaderboardError}</Typography>
          </Box>
        ) : leaderboard.length === 0 ? (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              No data available for this period.
            </Typography>
          </Box>
        ) : (
          <List disablePadding>
            {leaderboard.map((user) => (
              <ListItem key={user.id} divider>
                <ListItemAvatar>
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
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography
                      sx={{
                        cursor: 'pointer',
                        '&:hover': {
                          textDecoration: 'underline',
                          color: theme.palette.primary.main,
                        },
                      }}
                      onClick={(e) => handleUserNameClick(e, user.id)}
                    >
                      {user.name}
                    </Typography>
                  }
                  secondary={`${user.points.toLocaleString()} Haha Reactions`}
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
        )}
      </Card>
    </Box>
  );
};

RightContent.propTypes = {
  leaderboard: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      first_name: PropTypes.string,
      last_name: PropTypes.string,
      avatar: PropTypes.string,
      // add more fields if needed
    })
  ).isRequired,
  leaderboardLoading: PropTypes.bool.isRequired,
  leaderboardError: PropTypes.bool,
  tabValue: PropTypes.number.isRequired,
  handleTabChange: PropTypes.func.isRequired,
  handleUserNameClick: PropTypes.func.isRequired,
};

export default RightContent;
