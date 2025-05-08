import { useAuth } from 'hooks/useAuth';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Added useNavigate import
import { followUser } from 'services/follow.service';
import { getTopMemeAndLeaderboard, getAllTopMemesAndLeaderboards } from 'services/meme.service';
import { getSuggestedUsers } from 'services/user.service';
import { Whatshot } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Card,
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

const RightContent = () => {
  const { user } = useAuth({ middleware: 'auth' });
  const theme = useTheme();
  const navigate = useNavigate(); // Define navigate using useNavigate

  // State for Leaderboard
  const [leaderboard, setLeaderboard] = useState({
    daily: [],
    weekly: [],
    monthly: [],
  });
  const [leaderboardLoading, setLeaderboardLoading] = useState(true);
  const [leaderboardError, setLeaderboardError] = useState(null);
  const [tabValue, setTabValue] = useState('daily');

  // State for Suggested Users
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [loadingSuggestedUsers, setLoadingSuggestedUsers] = useState(true);

  // Fetch Leaderboard
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLeaderboardLoading(true);
        const allData = await getAllTopMemesAndLeaderboards();
        setLeaderboard({
          daily: allData.daily?.leaderboard || [],
          weekly: allData.weekly?.leaderboard || [],
          monthly: allData.monthly?.leaderboard || [],
        });
        setLeaderboardError(null);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
        setLeaderboardError('Failed to load leaderboard');
      } finally {
        setLeaderboardLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  // Fetch Suggested Users
  const fetchSuggestedUsers = async () => {
    const listSuggestedUsers = await getSuggestedUsers(user.id);
    if (!listSuggestedUsers) {
      setLoadingSuggestedUsers(true);
      return;
    }

    const sortedUsers = [...listSuggestedUsers].sort((a, b) => {
      if (a.mutual_count !== undefined && b.mutual_count !== undefined) {
        return b.mutual_count - a.mutual_count;
      }
      if (a.mutual_count !== undefined) return -1;
      if (b.mutual_count !== undefined) return 1;
      return 0;
    });

    setLoadingSuggestedUsers(false);
    setSuggestedUsers(sortedUsers);
  };

  useEffect(() => {
    fetchSuggestedUsers();
  }, [user]);

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
        setSuggestedUsers((prevUsers) => {
          const updatedUsers = [...prevUsers, newUser];
          return updatedUsers.sort((a, b) => {
            if (a.mutual_count !== undefined && b.mutual_count !== undefined) {
              return b.mutual_count - a.mutual_count;
            }
            if (a.mutual_count !== undefined) return -1;
            if (b.mutual_count !== undefined) return 1;
            return 0;
          });
        });
      }
    } catch (error) {
      console.error('Follow error: ', error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleUserNameClick = (event, userId) => {
    navigate(`/profile/${userId}`);
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
                  <Avatar
                    src={suggestedUser.avatar}
                    sx={{ bgcolor: theme.palette.mode === 'dark' ? '#4a3b6b' : '#e0e0ff' }}
                  >
                    {suggestedUser.first_name?.[0] || suggestedUser.last_name?.[0] || 'U'}
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
                      onClick={(e) => handleUserNameClick(e, suggestedUser.id)}
                    >
                      {`${suggestedUser.first_name} ${suggestedUser.last_name}`}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography variant="body2" component="span">
                        {suggestedUser.username ? `@${suggestedUser.username}` : ''}
                      </Typography>
                      {suggestedUser.mutual_count > 0 && (
                        <Typography
                          variant="body2"
                          component="span"
                          sx={{
                            color:
                              theme.palette.mode === 'dark'
                                ? 'rgba(255, 255, 255, 0.7)'
                                : 'rgba(0, 0, 0, 0.6)',
                            fontSize: '0.75rem',
                            ml: 1, // Add spacing instead of margin-top
                          }}
                        >
                          {suggestedUser.mutual_count} mutual friend
                          {suggestedUser.mutual_count !== 1 ? 's' : ''}
                        </Typography>
                      )}
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
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
            <Tab label="Daily" value="daily" />
            <Tab label="Weekly" value="weekly" />
            <Tab label="Monthly" value="monthly" />
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
        ) : leaderboard[tabValue].length === 0 ? (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              No data available for this period.
            </Typography>
          </Box>
        ) : (
          <List disablePadding>
            {leaderboard[tabValue].map((user) => (
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

export default RightContent;
