'use client';

import { useEffect, useState } from 'react';
import { getTopPost } from 'services/meme.service';
import {
  EmojiEvents,
  LocalFireDepartment,
  PhotoCamera,
  Star,
  ThumbUp,
  TrendingUp,
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material';

const LeftContent = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState('daily');
  const [topPosts, setTopPosts] = useState({
    daily: null,
    weekly: null,
    monthly: null,
  });

  // const categories = [
  //   { id: 1, name: 'Popular Memes', icon: <LocalFireDepartment color="primary" />, active: true },
  //   { id: 2, name: 'Trending Now', icon: <TrendingUp />, active: false },
  //   { id: 3, name: 'New Arrivals', icon: <Star />, active: false },
  //   { id: 4, name: 'Top Picks', icon: <ThumbUp />, active: false },
  // ];

  useEffect(() => {
    const fetchTopPosts = async () => {
      try {
        const periods = ['daily', 'weekly', 'monthly'];
        const results = await Promise.all(
          periods.map(async (period) => {
            const data = await getTopPost(period);
            console.log(`Top Post data for ${period}:`, data); // Log the API response
            return { period, post: data.top_post };
          })
        );

        const newTopPosts = results.reduce((acc, { period, post }) => {
          acc[period] = post;
          return acc;
        }, {});

        setTopPosts(newTopPosts);
      } catch (error) {
        console.error('Error fetching top posts:', error);
      }
    };

    fetchTopPosts();
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const renderTopPost = (post) => {
    if (!post) {
      return (
        <Box
          sx={{
            height: 120,
            bgcolor: theme.palette.mode === 'dark' ? '#1e1e2e' : theme.palette.background.paper,
            borderRadius: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 1,
          }}
        >
          <Typography variant="body2" color="text.disabled">
            No top post available for this period
          </Typography>
        </Box>
      );
    }

    return (
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Avatar
            src={post.author_avatar} // Use the avatar URL from the API
            sx={{ mr: 1, bgcolor: theme.palette.primary.main }}
          >
            {!post.author_avatar && (post.author ? post.author[0] : 'U')}{' '}
            {/* Fallback to initial if no avatar */}
          </Avatar>
          <Typography variant="subtitle2" fontWeight="medium">
            {post.author || 'Unknown'}
          </Typography>
          {post.is_king && <EmojiEvents sx={{ ml: 1, color: '#ffb300', fontSize: 20 }} />}
        </Box>
        {post.image ? (
          <Box
            component="img"
            src={post.image}
            alt={post.caption}
            sx={{
              width: '100%',
              height: 120,
              objectFit: 'cover',
              borderRadius: 1,
              mb: 1,
            }}
          />
        ) : (
          <Box
            sx={{
              height: 120,
              bgcolor: theme.palette.mode === 'dark' ? '#1e1e2e' : theme.palette.background.paper,
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 1,
            }}
          >
            <PhotoCamera sx={{ fontSize: 40, color: theme.palette.text.disabled }} />
          </Box>
        )}
        <Typography variant="body2" sx={{ mb: 1 }}>
          {post.caption || 'No caption available'}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {post.laugh_votes !== undefined
            ? `${post.laugh_votes} Laugh Votes`
            : 'No laugh votes available'}
        </Typography>
      </Box>
    );
  };

  return (
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
      {/* <Card sx={{ mb: 3 }}>
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
      </Card> */}

      <Card>
        <CardHeader
          title="Top Meme"
          sx={{
            bgcolor: theme.palette.mode === 'dark' ? '#4a3b6b' : theme.palette.primary.light,
            color: '#ffffff',
            py: 1.5,
          }}
        />
        <CardContent>
          <Tabs value={activeTab} onChange={handleTabChange} variant="fullWidth" sx={{ mb: 2 }}>
            <Tab label="Daily" value="daily" />
            <Tab label="Weekly" value="weekly" />
            <Tab label="Monthly" value="monthly" />
          </Tabs>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              bgcolor: theme.palette.mode === 'dark' ? '#2a2a3a' : theme.palette.secondary.light,
              color: theme.palette.mode === 'dark' ? '#ffffff' : theme.palette.secondary.dark,
              borderRadius: 2,
            }}
          >
            {renderTopPost(topPosts[activeTab])}
          </Paper>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LeftContent;
