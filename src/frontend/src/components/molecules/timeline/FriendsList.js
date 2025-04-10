import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
  Check as CheckIcon,
  PersonAdd as PersonAddIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Grid,
  InputAdornment,
  Paper,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { followUser, unfollowUser } from '../../../services/follow.service';

const FriendsList = ({ userId, isCurrentUser }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Fetch user friends/followers
    const fetchFriends = async () => {
      setLoading(true);
      try {
        // Mock data - replace with actual API call
        setTimeout(() => {
          const mockFriends = Array.from({ length: 20 }, (_, i) => ({
            id: i + 1,
            name: `Friend ${i + 1}`,
            avatar: `/placeholder.svg?height=50&width=50&text=F${i + 1}`,
            isFollowing: Math.random() > 0.5,
            mutualFriends: Math.floor(Math.random() * 10),
          }));
          setFriends(mockFriends);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching friends:', error);
        setLoading(false);
      }
    };

    fetchFriends();
  }, [userId, activeTab]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleFollowToggle = async (friendId, isFollowingNow) => {
    try {
      if (isFollowingNow) {
        await unfollowUser(friendId);
        toast.success('Unfollowed successfully');
      } else {
        await followUser(friendId);
        toast.success('Followed successfully');
      }

      // Update local state
      setFriends(
        friends.map((friend) =>
          friend.id === friendId ? { ...friend, isFollowing: !isFollowingNow } : friend
        )
      );
    } catch (error) {
      console.error('Error toggling follow status:', error);
      toast.error('Failed to update follow status');
    }
  };

  const filteredFriends = friends.filter((friend) =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box>
      <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="friends tabs">
            <Tab label={isCurrentUser ? 'Friends' : 'Friends'} />
            <Tab label={isCurrentUser ? 'Followers' : 'Followers'} />
            <Tab label={isCurrentUser ? 'Following' : 'Following'} />
          </Tabs>
        </Box>

        <TextField
          fullWidth
          placeholder="Search friends"
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={handleSearchChange}
          sx={{ mb: 3 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : filteredFriends.length > 0 ? (
          <Grid container spacing={2}>
            {filteredFriends.map((friend) => (
              <Grid item xs={12} sm={6} md={4} key={friend.id}>
                <Card sx={{ height: '100%' }}>
                  <CardContent sx={{ pb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar src={friend.avatar} sx={{ width: 60, height: 60, mr: 2 }} />
                      <Box>
                        <Typography variant="subtitle1" fontWeight="medium">
                          {friend.name}
                        </Typography>
                        {friend.mutualFriends > 0 && (
                          <Typography variant="body2" color="text.secondary">
                            {friend.mutualFriends} mutual friend{friend.mutualFriends !== 1 && 's'}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button
                      fullWidth
                      variant={friend.isFollowing ? 'outlined' : 'contained'}
                      size="small"
                      startIcon={friend.isFollowing ? <CheckIcon /> : <PersonAddIcon />}
                      onClick={() => handleFollowToggle(friend.id, friend.isFollowing)}
                    >
                      {friend.isFollowing ? 'Following' : 'Follow'}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              {searchQuery
                ? 'No friends match your search'
                : activeTab === 0
                ? 'No friends to show'
                : activeTab === 1
                ? 'No followers to show'
                : 'Not following anyone'}
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};
FriendsList.propTypes = {
  userId: PropTypes.number.isRequired,
  isCurrentUser: PropTypes.bool.isRequired,
};

export default FriendsList;
