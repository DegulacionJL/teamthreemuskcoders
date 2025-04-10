import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Cake as CakeIcon,
  Edit as EditIcon,
  LocationOn as LocationIcon,
  Message as MessageIcon,
  PhotoCamera as PhotoCameraIcon,
  School as SchoolIcon,
  Work as WorkIcon,
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  Grid,
  IconButton,
  Paper,
  Skeleton,
  Tab,
  Tabs,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import AboutSection from '../components/molecules/timeline/AboutSection';
import FriendsList from '../components/molecules/timeline/FriendsList';
import PhotosGrid from '../components/molecules/timeline/PhotosGrid';
import PostCard from '../components/molecules/timeline/PostCard';
import { followUser, isFollowing, unfollowUser } from '../services/follow.service';
import { getUserPosts, getUserProfile } from '../services/user.service';

const UserTimeline = () => {
  const { userId } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeTab, setActiveTab] = useState(0);
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFollowingUser, setIsFollowingUser] = useState(false);
  const [isCurrentUser, setIsCurrentUser] = useState(false);

  // Mock current user - replace with your auth context
  const currentUser = { id: 1, role: 'user' };

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        // Check if this is the current user's profile
        setIsCurrentUser(Number.parseInt(userId) === currentUser.id);

        // Fetch user profile data
        const profileData = await getUserProfile(userId);
        setProfile(profileData);

        // Fetch user posts
        const postsData = await getUserPosts(userId);
        setPosts(postsData);

        // Check if current user is following this user
        if (!isCurrentUser) {
          const followStatus = await isFollowing(userId);
          setIsFollowingUser(followStatus);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Failed to load user profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleFollowToggle = async () => {
    try {
      if (isFollowingUser) {
        await unfollowUser(userId);
        toast.success('Unfollowed successfully');
      } else {
        await followUser(userId);
        toast.success('Followed successfully');
      }
      setIsFollowingUser(!isFollowingUser);
    } catch (error) {
      console.error('Error toggling follow status:', error);
      toast.error('Failed to update follow status');
    }
  };

  const handleCoverPhotoUpload = () => {
    // Implement cover photo upload logic
    console.log('Upload cover photo');
  };

  const handleProfilePhotoUpload = () => {
    // Implement profile photo upload logic
    console.log('Upload profile photo');
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Skeleton variant="rectangular" width="100%" height={300} />
        <Box sx={{ display: 'flex', mt: -8, ml: 4, position: 'relative' }}>
          <Skeleton variant="circular" width={150} height={150} />
        </Box>
        <Box sx={{ mt: 8, ml: 2 }}>
          <Skeleton variant="text" width={200} height={40} />
          <Skeleton variant="text" width={300} height={30} />
        </Box>
        <Skeleton variant="rectangular" width="100%" height={50} sx={{ mt: 2 }} />
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={4}>
            <Skeleton variant="rectangular" width="100%" height={400} />
          </Grid>
          <Grid item xs={12} md={8}>
            <Skeleton variant="rectangular" width="100%" height={200} sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" width="100%" height={200} />
          </Grid>
        </Grid>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      {/* Cover Photo */}
      <Paper
        sx={{
          height: 300,
          width: '100%',
          position: 'relative',
          backgroundImage: profile?.coverPhoto
            ? `url(${profile.coverPhoto})`
            : 'linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        {isCurrentUser && (
          <IconButton
            sx={{
              position: 'absolute',
              bottom: 16,
              right: 16,
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
              },
            }}
            onClick={handleCoverPhotoUpload}
          >
            <PhotoCameraIcon />
          </IconButton>
        )}
      </Paper>

      {/* Profile Info Section */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'center' : 'flex-end',
          mt: isMobile ? -8 : -10,
          position: 'relative',
          px: 3,
        }}
      >
        {/* Profile Avatar */}
        <Box sx={{ position: 'relative' }}>
          <Avatar
            src={profile?.avatar}
            sx={{
              width: isMobile ? 120 : 180,
              height: isMobile ? 120 : 180,
              border: '4px solid white',
              boxShadow: theme.shadows[3],
            }}
          />
          {isCurrentUser && (
            <IconButton
              size="small"
              sx={{
                position: 'absolute',
                bottom: 5,
                right: 5,
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                },
              }}
              onClick={handleProfilePhotoUpload}
            >
              <PhotoCameraIcon fontSize="small" />
            </IconButton>
          )}
        </Box>

        {/* User Info and Actions */}
        <Box
          sx={{
            ml: isMobile ? 0 : 3,
            mt: isMobile ? 2 : 0,
            mb: 2,
            flex: 1,
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: isMobile ? 'center' : 'flex-end',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ textAlign: isMobile ? 'center' : 'left' }}>
            <Typography variant="h4" fontWeight="bold">
              {profile?.firstName} {profile?.lastName}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
              {profile?.bio || 'No bio yet'}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.5, display: 'flex', alignItems: 'center' }}
            >
              <LocationIcon fontSize="small" sx={{ mr: 0.5 }} />
              {profile?.location || 'No location set'}
            </Typography>
          </Box>

          <Box sx={{ mt: isMobile ? 2 : 0, display: 'flex', gap: 1 }}>
            {!isCurrentUser && (
              <Button
                variant={isFollowingUser ? 'outlined' : 'contained'}
                color="primary"
                onClick={handleFollowToggle}
              >
                {isFollowingUser ? 'Unfollow' : 'Follow'}
              </Button>
            )}
            {!isCurrentUser && (
              <Button variant="outlined" startIcon={<MessageIcon />}>
                Message
              </Button>
            )}
            {isCurrentUser && (
              <Button variant="outlined" startIcon={<EditIcon />}>
                Edit Profile
              </Button>
            )}
          </Box>
        </Box>
      </Box>

      {/* Stats Bar */}
      <Paper
        sx={{
          mt: 3,
          p: 2,
          borderRadius: 2,
          display: 'flex',
          justifyContent: 'space-around',
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" fontWeight="bold">
            {profile?.postsCount || 0}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Posts
          </Typography>
        </Box>
        <Divider orientation="vertical" flexItem />
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" fontWeight="bold">
            {profile?.followersCount || 0}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Followers
          </Typography>
        </Box>
        <Divider orientation="vertical" flexItem />
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" fontWeight="bold">
            {profile?.followingCount || 0}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Following
          </Typography>
        </Box>
      </Paper>

      {/* Navigation Tabs */}
      <Box sx={{ mt: 3, borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant={isMobile ? 'scrollable' : 'standard'}
          scrollButtons={isMobile ? 'auto' : false}
          centered={!isMobile}
        >
          <Tab label="Posts" />
          <Tab label="About" />
          <Tab label="Friends" />
          <Tab label="Photos" />
        </Tabs>
      </Box>

      {/* Content Area */}
      <Grid container spacing={3} sx={{ mt: 1 }}>
        {/* Sidebar - only show on desktop */}
        {!isMobile && (
          <Grid item xs={12} md={4}>
            <Box sx={{ position: 'sticky', top: 80 }}>
              {/* About Card */}
              <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                  About
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                  <WorkIcon sx={{ mr: 1.5, color: 'text.secondary' }} />
                  <Typography variant="body2">
                    Works at {profile?.work || 'Not specified'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                  <SchoolIcon sx={{ mr: 1.5, color: 'text.secondary' }} />
                  <Typography variant="body2">
                    Studied at {profile?.education || 'Not specified'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                  <LocationIcon sx={{ mr: 1.5, color: 'text.secondary' }} />
                  <Typography variant="body2">
                    Lives in {profile?.location || 'Not specified'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CakeIcon sx={{ mr: 1.5, color: 'text.secondary' }} />
                  <Typography variant="body2">
                    Born on {profile?.birthday || 'Not specified'}
                  </Typography>
                </Box>
              </Paper>

              {/* Photos Card */}
              <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                  }}
                >
                  <Typography variant="h6" fontWeight="bold">
                    Photos
                  </Typography>
                  <Typography variant="body2" color="primary" sx={{ cursor: 'pointer' }}>
                    See All
                  </Typography>
                </Box>
                <Grid container spacing={1}>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
                    <Grid item xs={4} key={item}>
                      <Box
                        sx={{
                          paddingTop: '100%', // 1:1 Aspect Ratio
                          position: 'relative',
                          borderRadius: 1,
                          overflow: 'hidden',
                        }}
                      >
                        <Box
                          component="img"
                          src={`/placeholder.svg?height=100&width=100&text=Photo ${item}`}
                          alt={`Photo ${item}`}
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Paper>

              {/* Friends Card */}
              <Paper sx={{ p: 3, borderRadius: 2 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                  }}
                >
                  <Typography variant="h6" fontWeight="bold">
                    Friends
                  </Typography>
                  <Typography variant="body2" color="primary" sx={{ cursor: 'pointer' }}>
                    See All
                  </Typography>
                </Box>
                <Grid container spacing={1}>
                  {[1, 2, 3, 4, 5, 6].map((item) => (
                    <Grid item xs={6} key={item}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Avatar
                          src={`/placeholder.svg?height=40&width=40&text=F${item}`}
                          sx={{ mr: 1 }}
                        />
                        <Typography variant="body2" noWrap>
                          Friend {item}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Box>
          </Grid>
        )}

        {/* Main Content */}
        <Grid item xs={12} md={!isMobile ? 8 : 12}>
          {/* Tab Content */}
          {activeTab === 0 && (
            <Box>
              {/* Create Post Card - only for current user or on mobile */}
              {(isCurrentUser || isMobile) && (
                <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar src={currentUser?.avatar} sx={{ mr: 2 }} />
                    <Button
                      variant="outlined"
                      fullWidth
                      sx={{
                        justifyContent: 'flex-start',
                        textTransform: 'none',
                        py: 1.5,
                        borderRadius: 10,
                        color: 'text.secondary',
                      }}
                    >
                      <p>What&#39;s on your mind?</p>
                    </Button>
                  </Box>
                </Paper>
              )}

              {/* Posts List */}
              {posts.length > 0 ? (
                posts.map((post) => <PostCard key={post.id} post={post} />)
              ) : (
                <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
                  <Typography variant="h6" color="text.secondary">
                    No posts to show
                  </Typography>
                  {isCurrentUser && (
                    <Button variant="contained" sx={{ mt: 2 }}>
                      Create Your First Post
                    </Button>
                  )}
                </Paper>
              )}
            </Box>
          )}

          {activeTab === 1 && <AboutSection profile={profile} isCurrentUser={isCurrentUser} />}
          {activeTab === 2 && <FriendsList userId={userId} isCurrentUser={isCurrentUser} />}
          {activeTab === 3 && <PhotosGrid userId={userId} isCurrentUser={isCurrentUser} />}
        </Grid>
      </Grid>
    </Container>
  );
};

export default UserTimeline;
