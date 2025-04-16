'use client';

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
  const theme = useTheme();

  const trendingTags = [
    { id: 1, label: '#MemeMonday', color: 'primary' },
    { id: 2, label: '#GabingLagum', color: 'primary' },
    { id: 3, label: '#MlbbFunnyMoments', color: 'primary' },
    { id: 4, label: '#ProgrammerHumor', color: 'secondary' },
    { id: 5, label: '#DadJokes', color: 'success' },
  ];

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '25%',
        position: 'sticky',
        top: '16px', // Add some space from the top
        maxHeight: 'calc(100vh - 32px)', // Set max height to viewport height minus margins
        overflowY: 'auto', // Enable scrolling within the sidebar
        pt: 2,
        pb: 2, // Add padding at the bottom
        display: { xs: 'none', md: 'block' },
        // Custom scrollbar styling
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
                    onClick={(e) => handleUserNameClick(e, index)}
                  >
                    {`User ${index}`}
                  </Typography>
                }
                secondary={`@user${index}`}
              />
            </ListItem>
          ))}
        </List>
      </Card>

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

export default RightContent;
