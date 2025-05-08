import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTopMemeAndLeaderboard, getAllTopMemesAndLeaderboards } from 'services/meme.service';
// Updated import
import { getTrendingMemes } from 'services/user.service';
import { EmojiEvents, PhotoCamera } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
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
  const [trendingHashtags, setTrendingHashtags] = useState([]);
  const [loadingTrendingHashtags, setLoadingTrendingHashtags] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopPosts = async () => {
      try {
        const allData = await getAllTopMemesAndLeaderboards();
        setTopPosts({
          daily: allData.daily?.top_post || null,
          weekly: allData.weekly?.top_post || null,
          monthly: allData.monthly?.top_post || null,
        });
      } catch (error) {
        console.error('Error fetching top posts:', error);
      }
    };
    fetchTopPosts();
  }, []);

  useEffect(() => {
    const fetchTrendingHashtags = async () => {
      try {
        const hashtags = await getTrendingMemes({ cacheBust: Date.now() });
        setTrendingHashtags(hashtags || []);
      } catch (error) {
        console.error('Error fetching trending hashtags: ', error);
      } finally {
        setLoadingTrendingHashtags(false);
      }
    };
    fetchTrendingHashtags();
    const intervalId = setInterval(fetchTrendingHashtags, 10000);
    return () => clearInterval(intervalId);
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleHashtagClick = (hashtag) => {
    navigate(`/hashtag/${encodeURIComponent(hashtag.replace(/^#/, ''))}`);
  };

  const renderTopPost = (post) => {
    if (!post) {
      return (
        <Box
          sx={{
            height: 150,
            bgcolor: theme.palette.mode === 'dark' ? '#1e1e2e' : theme.palette.grey[200],
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 1,
            transition: 'all 0.3s ease',
          }}
        >
          <Typography variant="body2" color="text.disabled">
            No top post available for this period
          </Typography>
        </Box>
      );
    }

    return (
      <Box sx={{ transition: 'all 0.3s ease' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
          <Avatar
            src={post.author_avatar}
            sx={{
              mr: 1.5,
              bgcolor: theme.palette.primary.main,
              width: 40,
              height: 40,
            }}
          >
            {!post.author_avatar && (post.author ? post.author[0] : 'U')}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle2" fontWeight="medium" sx={{ lineHeight: 1.2 }}>
              {post.author || 'Unknown'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {`Top Meme ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Creator`}
            </Typography>
          </Box>
          {post.is_king && (
            <EmojiEvents
              sx={{
                color: '#ffb300',
                fontSize: 24,
                bgcolor: theme.palette.background.paper,
                borderRadius: '50%',
                p: 0.5,
              }}
            />
          )}
        </Box>
        {post.image ? (
          <Box
            component="img"
            src={post.image}
            alt={post.caption}
            sx={{
              width: '100%',
              height: 160,
              objectFit: 'cover',
              borderRadius: 2,
              mb: 1.5,
              boxShadow:
                theme.palette.mode === 'dark'
                  ? '0 4px 12px rgba(0,0,0,0.3)'
                  : '0 4px 12px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'scale(1.02)',
              },
            }}
          />
        ) : (
          <Box
            sx={{
              height: 160,
              bgcolor: theme.palette.mode === 'dark' ? '#1e1e2e' : theme.palette.grey[200],
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 1.5,
            }}
          >
            <PhotoCamera sx={{ fontSize: 40, color: theme.palette.text.disabled }} />
          </Box>
        )}
        <Typography
          variant="body2"
          sx={{
            mb: 1,
            fontStyle: post.caption ? 'normal' : 'italic',
            color: post.caption ? 'text.primary' : 'text.disabled',
          }}
        >
          {post.caption || 'No caption available'}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography sx={{ fontSize: 16 }}>😂</Typography>
          <Typography variant="caption" color="text.secondary">
            {post.laugh_votes !== undefined
              ? `${post.laugh_votes} Laugh Votes`
              : 'No laugh votes available'}
          </Typography>
        </Box>
      </Box>
    );
  };

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '22%',
        position: 'sticky',
        top: 16,
        height: 'calc(100vh - 32px)',
        pt: 2,
        pb: 2,
        display: { xs: 'none', md: 'block' },
        overflowY: 'auto',
        '&::-webkit-scrollbar': {
          width: '6px',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: theme.palette.mode === 'dark' ? '#555' : '#ccc',
          borderRadius: '3px',
        },
      }}
    >
      <Card
        sx={{
          borderRadius: 3,
          boxShadow:
            theme.palette.mode === 'dark'
              ? '0 4px 20px rgba(0,0,0,0.3)'
              : '0 4px 20px rgba(0,0,0,0.08)',
          transition: 'all 0.3s ease',
          bgcolor: theme.palette.mode === 'dark' ? '#2a2a3a' : '#ffffff',
        }}
      >
        <CardHeader
          title="Top Meme Creators"
          sx={{
            bgcolor: theme.palette.mode === 'dark' ? '#4a3b6b' : theme.palette.primary.light,
            color: '#ffffff',
            py: 1.5,
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
            textAlign: 'center',
            '& .MuiCardHeader-title': {
              fontSize: '1.1rem',
              fontWeight: 500,
            },
          }}
        />
        <CardContent sx={{ p: 0, pb: 0 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{
              mb: 0,
              borderBottom: `1px solid ${theme.palette.divider}`,
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '0.9rem',
                py: 1.5,
              },
              '& .Mui-selected': {
                color: theme.palette.primary.main,
              },
              '& .MuiTabs-indicator': {
                backgroundColor: theme.palette.primary.main,
                height: 3,
              },
            }}
          >
            <Tab label="Daily" value="daily" />
            <Tab label="Weekly" value="weekly" />
            <Tab label="Monthly" value="monthly" />
          </Tabs>
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              pb: 1.5,
              bgcolor: theme.palette.mode === 'dark' ? '#2a2a3a' : '#ffffff',
              color: theme.palette.mode === 'dark' ? '#ffffff' : theme.palette.text.primary,
              borderBottomLeftRadius: 12,
              borderBottomRightRadius: 12,
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0,
            }}
          >
            {renderTopPost(topPosts[activeTab])}
          </Paper>
        </CardContent>
      </Card>

      <Card sx={{ mt: 3 }}>
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
                  onClick={() => handleHashtagClick(hashtag.hashtag)}
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
    </Box>
  );
};

export default LeftContent;
