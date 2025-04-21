'use client';

import PropTypes from 'prop-types';
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
  suggestedUsers,
  suggestedUsersLoading,
  suggestedUsersError,
  trendingTags,
  trendingTagsLoading,
  trendingTagsError,
  tabValue,
  handleTabChange,
  handleUserNameClick,
}) => {
  const theme = useTheme();

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
        {suggestedUsersLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress size={24} />
          </Box>
        ) : suggestedUsersError ? (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography color="error">{suggestedUsersError}</Typography>
          </Box>
        ) : suggestedUsers.length === 0 ? (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              No suggested users available.
            </Typography>
          </Box>
        ) : (
          <List disablePadding>
            {suggestedUsers.map((user) => (
              <ListItem
                key={user.id}
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
                  <Avatar
                    src={user.avatar}
                    sx={{ bgcolor: theme.palette.mode === 'dark' ? '#4a3b6b' : '#e0e0ff' }}
                  >
                    {user.displayName ? user.displayName[0] : user.username[0]}
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
                      {user.displayName || user.username}
                    </Typography>
                  }
                  secondary={`@${user.username}`}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Card>

      {/* Trending Memes */}
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
          {trendingTagsLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
              <CircularProgress size={24} />
            </Box>
          ) : trendingTagsError ? (
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography color="error">{trendingTagsError}</Typography>
            </Box>
          ) : trendingTags.length === 0 ? (
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                No trending tags available.
              </Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {trendingTags.map((tag) => (
                <Chip
                  key={tag.id}
                  label={tag.label}
                  color={tag.color || 'primary'}
                  variant="filled"
                  clickable
                  sx={{
                    bgcolor:
                      tag.color === 'primary'
                        ? '#4a3b6b'
                        : tag.color === 'secondary'
                        ? '#5d4037'
                        : tag.color === 'success'
                        ? '#2e7d32'
                        : '#4a3b6b',
                    color: '#ffffff',
                    '&:hover': {
                      bgcolor:
                        tag.color === 'primary'
                          ? '#5a4b7b'
                          : tag.color === 'secondary'
                          ? '#6d5047'
                          : tag.color === 'success'
                          ? '#3e8d42'
                          : '#5a4b7b',
                    },
                  }}
                />
              ))}
            </Box>
          )}
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
            {suggestedUsers.map((user) => {
              if (!user) return null; // Skip null or undefined users

              return (
                <ListItem
                  key={user.id}
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
                    <Avatar
                      src={user.avatar}
                      sx={{ bgcolor: theme.mode === 'dark' ? '#4a3b6b' : '#e0e0ff' }}
                    >
                      {user?.displayName?.[0] || user?.username?.[0] || 'U'}
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
                        {user?.displayName || user?.username || 'Unknown User'}
                      </Typography>
                    }
                    secondary={user?.username ? `@${user.username}` : null}
                  />
                </ListItem>
              );
            })}
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
      name: PropTypes.string,
      points: PropTypes.number,
      rank: PropTypes.number,
    })
  ).isRequired,
  leaderboardLoading: PropTypes.bool.isRequired,
  leaderboardError: PropTypes.string,
  suggestedUsers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      username: PropTypes.string,
      displayName: PropTypes.string,
      avatar: PropTypes.string,
    })
  ).isRequired,
  suggestedUsersLoading: PropTypes.bool.isRequired,
  suggestedUsersError: PropTypes.string,
  trendingTags: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      label: PropTypes.string,
      color: PropTypes.string,
    })
  ).isRequired,
  trendingTagsLoading: PropTypes.bool.isRequired,
  trendingTagsError: PropTypes.string,
  tabValue: PropTypes.number.isRequired,
  handleTabChange: PropTypes.func.isRequired,
  handleUserNameClick: PropTypes.func.isRequired,
};

export default RightContent;
