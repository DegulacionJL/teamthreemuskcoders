'use client';

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
import { getUserConnections } from '../../../services/user.service';

const FriendsList = ({ userId, isCurrentUser }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [connections, setConnections] = useState({ followers: [], following: [] });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Fetch user connections (friends, followers, following)
    const fetchConnections = async () => {
      setLoading(true);
      try {
        const data = await getUserConnections(userId);
        setConnections(data);
      } catch (error) {
        console.error('Error fetching connections:', error);
        toast.error('Failed to load connections');
        setConnections({ followers: [], following: [] });
      } finally {
        setLoading(false);
      }
    };

    fetchConnections();
  }, [userId]);

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

      // Refresh connections after follow/unfollow
      const data = await getUserConnections(userId);
      setConnections(data);
    } catch (error) {
      console.error('Error toggling follow status:', error);
      toast.error('Failed to update follow status');
    }
  };

  // Determine which connections to display based on active tab
  const getDisplayConnections = () => {
    // For the Friends tab, we'll combine followers and following to show mutual connections
    if (activeTab === 0) {
      // Create a map of user IDs who are both followers and following
      const followingIds = new Set(connections.following.map((user) => user.id));
      const mutualConnections = connections.followers.filter((user) => followingIds.has(user.id));

      return mutualConnections.map((user) => ({
        id: user.id,
        name: user.name,
        avatar: user.avatar || `/placeholder.svg?height=50&width=50&text=${user.name.charAt(0)}`,
        isFollowing: true, // They must be following if they're mutual
        mutualFriends: 0, // We don't have this data from the API
        since: user.since,
      }));
    }
    // For the Followers tab
    else if (activeTab === 1) {
      return connections.followers.map((user) => {
        // Check if we're following this follower
        const isFollowing = connections.following.some((following) => following.id === user.id);

        return {
          id: user.id,
          name: user.name,
          avatar: user.avatar || `/placeholder.svg?height=50&width=50&text=${user.name.charAt(0)}`,
          isFollowing: isFollowing,
          mutualFriends: 0, // We don't have this data from the API
          since: user.since,
        };
      });
    }
    // For the Following tab
    else {
      return connections.following.map((user) => ({
        id: user.id,
        name: user.name,
        avatar: user.avatar || `/placeholder.svg?height=50&width=50&text=${user.name.charAt(0)}`,
        isFollowing: true, // We're following them by definition
        mutualFriends: 0, // We don't have this data from the API
        since: user.since,
      }));
    }
  };

  const displayConnections = getDisplayConnections();
  const filteredConnections = displayConnections.filter((connection) =>
    connection.name.toLowerCase().includes(searchQuery.toLowerCase())
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
          placeholder="Search connections"
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
        ) : filteredConnections.length > 0 ? (
          <Grid container spacing={2}>
            {filteredConnections.map((connection) => (
              <Grid item xs={12} sm={6} md={4} key={connection.id}>
                <Card sx={{ height: '100%' }}>
                  <CardContent sx={{ pb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar src={connection.avatar} sx={{ width: 60, height: 60, mr: 2 }} />
                      <Box>
                        <Typography variant="subtitle1" fontWeight="medium">
                          {connection.name}
                        </Typography>
                        {connection.since && (
                          <Typography variant="body2" color="text.secondary">
                            Connected since {new Date(connection.since).toLocaleDateString()}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button
                      fullWidth
                      variant={connection.isFollowing ? 'outlined' : 'contained'}
                      size="small"
                      startIcon={connection.isFollowing ? <CheckIcon /> : <PersonAddIcon />}
                      onClick={() => handleFollowToggle(connection.id, connection.isFollowing)}
                    >
                      {connection.isFollowing ? 'Following' : 'Follow'}
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
                ? 'No connections match your search'
                : activeTab === 0
                ? 'No mutual connections to show'
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
