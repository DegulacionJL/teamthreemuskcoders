import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Paper,
  Skeleton,
  Tab,
  Tabs,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import AboutSection from '../components/molecules/timeline/AboutSection';
import FriendsList from '../components/molecules/timeline/FriendsList';
import PhotosGrid from '../components/molecules/timeline/PhotosGrid';
import PostCard from '../components/molecules/timeline/PostCard';
import { useAuth } from '../contexts/AuthContext';
import { followUser, isFollowing, unfollowUser } from '../services/follow.service';
import {
  getUserPosts,
  getUserProfile,
  updateUserProfile,
  uploadCoverPhoto,
  uploadUserAvatar,
} from '../services/user.service';

// Import your auth context

const UserTimeline = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeTab, setActiveTab] = useState(0);
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFollowingUser, setIsFollowingUser] = useState(false);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    bio: '',
    work: '',
    education: '',
    location: '',
    birthday: '',
    website: '',
    relationship: '',
  });

  // Get actual authenticated user from your auth context
  const { user: currentUser, isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        // Check if this is the current user's profile
        const parsedUserId = Number.parseInt(userId);
        const isOwner = isAuthenticated && currentUser && currentUser.id === parsedUserId;
        setIsCurrentUser(isOwner);

        // Fetch user profile data
        const profileData = await getUserProfile(userId);
        setProfile(profileData);

        // Initialize edit form data
        setProfileData({
          bio: profileData.bio || '',
          work: profileData.work || '',
          education: profileData.education || '',
          location: profileData.location || '',
          birthday: profileData.birthday || '',
          website: profileData.website || '',
          relationship: profileData.relationship || '',
        });

        // Fetch user posts
        const postsData = await getUserPosts(userId);
        setPosts(postsData.posts || []);

        // Check if current user is following this user
        if (isAuthenticated && !isOwner) {
          try {
            const followStatus = await isFollowing(userId);
            setIsFollowingUser(followStatus.following);
          } catch (error) {
            console.error('Error checking follow status:', error);
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Failed to load user profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();

    // Scroll to the top of the page when userId changes (i.e., on navigation)
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [userId, currentUser, isAuthenticated]); // Dependency on userId ensures this runs on navigation

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleFollowToggle = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to follow users');
      navigate('/login');
      return;
    }

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

  const handleCoverPhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('coverPhoto', file);

      const result = await uploadCoverPhoto(userId, file);

      // Update the profile state with the new cover photo
      setProfile({
        ...profile,
        coverPhoto: result.coverPhoto,
      });

      toast.success('Cover photo updated successfully');
    } catch (error) {
      console.error('Error uploading cover photo:', error);
      toast.error('Failed to upload cover photo');
    }
  };

  const handleProfilePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const result = await uploadUserAvatar(userId, file);

      // Update the profile state with the new avatar
      setProfile({
        ...profile,
        avatar: result.avatar,
      });

      toast.success('Profile photo updated successfully');
    } catch (error) {
      console.error('Error uploading profile photo:', error);
      toast.error('Failed to upload profile photo');
    }
  };

  const handleEditProfile = () => {
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
  };

  const handleProfileDataChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value,
    });
  };

  const handleSaveProfile = async () => {
    try {
      const updatedProfile = await updateUserProfile(userId, profileData);
      setProfile(updatedProfile);
      setEditDialogOpen(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
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
          <>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="cover-photo-upload"
              type="file"
              onChange={handleCoverPhotoUpload}
            />
            <label htmlFor="cover-photo-upload">
              <IconButton
                component="span"
                sx={{
                  position: 'absolute',
                  bottom: 16,
                  right: 16,
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  },
                }}
              >
                <PhotoCameraIcon />
              </IconButton>
            </label>
          </>
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
            <>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="avatar-upload"
                type="file"
                onChange={handleProfilePhotoUpload}
              />
              <label htmlFor="avatar-upload">
                <IconButton
                  component="span"
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
                >
                  <PhotoCameraIcon fontSize="small" />
                </IconButton>
              </label>
            </>
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
            {!isCurrentUser && isAuthenticated && (
              <Button
                variant={isFollowingUser ? 'outlined' : 'contained'}
                color="primary"
                onClick={handleFollowToggle}
              >
                {isFollowingUser ? 'Unfollow' : 'Follow'}
              </Button>
            )}
            {!isCurrentUser && isAuthenticated && (
              <Button variant="outlined" startIcon={<MessageIcon />}>
                Message
              </Button>
            )}
            {isCurrentUser && (
              <Button variant="outlined" startIcon={<EditIcon />} onClick={handleEditProfile}>
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

              {/* Photos Card - Will be populated by the PhotosGrid component */}
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
                  <Typography
                    variant="body2"
                    color="primary"
                    sx={{ cursor: 'pointer' }}
                    onClick={() => setActiveTab(3)}
                  >
                    See All
                  </Typography>
                </Box>
                <PhotosGrid userId={userId} isCurrentUser={isCurrentUser} preview={true} />
              </Paper>

              {/* Friends Card - Will be populated by the FriendsList component */}
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
                  <Typography
                    variant="body2"
                    color="primary"
                    sx={{ cursor: 'pointer' }}
                    onClick={() => setActiveTab(2)}
                  >
                    See All
                  </Typography>
                </Box>
                <FriendsList userId={userId} isCurrentUser={isCurrentUser} preview={true} />
              </Paper>
            </Box>
          </Grid>
        )}

        {/* Main Content */}
        <Grid item xs={12} md={!isMobile ? 8 : 12}>
          {/* Tab Content */}
          {activeTab === 0 && (
            <Box>
              {/* Create Post Card - only for current user */}
              {isCurrentUser && (
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
                      onClick={() => navigate('/create-post')}
                    >
                      <p>What's on your mind?</p>
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
                    <Button
                      variant="contained"
                      sx={{ mt: 2 }}
                      onClick={() => navigate('/create-post')}
                    >
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

      {/* Edit Profile Dialog */}
      <Dialog open={editDialogOpen} onClose={handleCloseEditDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="bio"
            label="Bio"
            type="text"
            fullWidth
            multiline
            rows={3}
            value={profileData.bio}
            onChange={handleProfileDataChange}
          />
          <TextField
            margin="dense"
            name="work"
            label="Works at"
            type="text"
            fullWidth
            value={profileData.work}
            onChange={handleProfileDataChange}
          />
          <TextField
            margin="dense"
            name="education"
            label="Studied at"
            type="text"
            fullWidth
            value={profileData.education}
            onChange={handleProfileDataChange}
          />
          <TextField
            margin="dense"
            name="location"
            label="Adress"
            type="text"
            fullWidth
            value={profileData.location}
            onChange={handleProfileDataChange}
          />
          <TextField
            margin="dense"
            name="birthday"
            label="Birthday"
            type="date"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            value={profileData.birthday}
            onChange={handleProfileDataChange}
          />
          <TextField
            margin="dense"
            name="website"
            label="Website"
            type="url"
            fullWidth
            value={profileData.website}
            onChange={handleProfileDataChange}
          />
          <TextField
            margin="dense"
            name="relationship"
            label="Relationship Status"
            type="text"
            fullWidth
            value={profileData.relationship}
            onChange={handleProfileDataChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Cancel</Button>
          <Button onClick={handleSaveProfile} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserTimeline;
