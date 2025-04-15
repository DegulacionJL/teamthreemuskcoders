'use client';

import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Check as CheckIcon, PersonAdd as PersonAddIcon } from '@mui/icons-material';
import { Avatar, Box, Button, Card, CardContent, Typography } from '@mui/material';
import { followUser, unfollowUser } from '../../../services/follow.service';

const UserCard = ({ user }) => {
  const navigate = useNavigate();
  const [isFollowing, setIsFollowing] = useState(user.isFollowing || false);
  const [isLoading, setIsLoading] = useState(false);

  const handleFollowToggle = async () => {
    setIsLoading(true);
    try {
      if (isFollowing) {
        await unfollowUser(user.id);
        toast.success('Unfollowed successfully');
      } else {
        await followUser(user.id);
        toast.success('Followed successfully');
      }
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error('Error toggling follow status:', error);
      toast.error('Failed to update follow status');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card sx={{ mb: 2, borderRadius: 2 }}>
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
            }}
            onClick={() => navigate(`/users/${user.id}`)}
          >
            <Avatar src={user.avatar} alt={user.name} sx={{ mr: 1.5 }} />
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 'medium' }}>
                {user.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                @{user.username}
              </Typography>
            </Box>
          </Box>
          <Button
            variant={isFollowing ? 'outlined' : 'contained'}
            size="small"
            startIcon={isFollowing ? <CheckIcon /> : <PersonAddIcon />}
            onClick={handleFollowToggle}
            disabled={isLoading}
            sx={{ minWidth: 90 }}
          >
            {isFollowing ? 'Following' : 'Follow'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};
UserCard.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    username: PropTypes.string,
    avatar: PropTypes.string,
    isFollowing: PropTypes.bool,
  }).isRequired,
};

export default UserCard;
