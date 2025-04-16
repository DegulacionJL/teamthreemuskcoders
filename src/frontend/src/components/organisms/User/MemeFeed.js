'use client';

import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useNavigate } from 'react-router-dom';
import {
  createMemePost,
  deletePost,
  getLeaderboard,
  getMemePosts,
  reportPost,
  updateImage,
  updatePost,
} from 'services/meme.service';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useTheme } from '@mui/material';
import { useTheme as useCustomTheme } from '../../../theme/ThemeContext';
import CreatePostCard from './CreatePostCard';
// Import components
import LeftSidebar from './LeftContent';
import MemePost from './MemePost';
import RightSidebar from './RightContent';

function MemeFeed() {
  const theme = useTheme();
  const { darkMode } = useCustomTheme();
  const navigate = useNavigate();

  // State
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [currentUser, setCurrentUser] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [showMemeCreator, setShowMemeCreator] = useState(false);
  const [error, setError] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(false);
  const [leaderboardError, setLeaderboardError] = useState(null);

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const open = Boolean(anchorEl);

  // Menu handlers
  const handleMenuOpen = (event, postId) => {
    setAnchorEl(event.currentTarget);
    setSelectedPostId(postId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPostId(null);
  };

  // Post handlers
  const handleDelete = async (postId) => {
    try {
      await deletePost(postId);
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
      handleMenuClose();
      fetchLeaderboard(getPeriodFromTab(tabValue));
    } catch (error) {
      console.error('Error deleting post:', error);
      setError('Failed to delete post. Please try again.');
    }
  };

  const handleReportPost = async (postId) => {
    try {
      await reportPost(postId);
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
      handleMenuClose();
      fetchLeaderboard(getPeriodFromTab(tabValue));
    } catch (error) {
      console.error('Failed to report Post: ', error);
      setError('Failed to report Post. Please try again.');
    }
  };

  const dataURLtoFile = (dataurl, filename) => {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  };

  const handlePost = async () => {
    try {
      const formData = new FormData();
      formData.append('caption', caption);
      formData.append('image', image);
      formData.append('user_id', '1');

      const response = await createMemePost(formData);

      if (!response || !response.data || !response.data.id) {
        throw new Error('Failed to create post');
      }

      setPage(1);
      setPosts([]);
      await fetchPosts(1);
      fetchLeaderboard(getPeriodFromTab(tabValue));

      setCaption('');
      setImage(null);
      setImagePreview(null);
      setShowMemeCreator(false);
    } catch (error) {
      console.error('Error posting:', error);
      setError('Failed to create post. Please try again.');
    }
  };

  const handleUpdatePost = async (postId, newCaption, newImage) => {
    try {
      console.log('Updating post:', { postId, newCaption, newImage });

      if (newCaption) {
        await updatePost(postId, { caption: newCaption });
      }

      if (newImage) {
        const formData = new FormData();
        formData.append('image', newImage);
        const response = await updateImage(postId, formData);

        const updatedImageUrl = response.data.image.image_path + `?t=${new Date().getTime()}`;
        setPosts((prevPosts) =>
          prevPosts.map((post) => (post.id === postId ? { ...post, image: updatedImageUrl } : post))
        );
      }

      setPage(1);
      setPosts([]);
      await fetchPosts(1);
      fetchLeaderboard(getPeriodFromTab(tabValue));
    } catch (error) {
      console.error('Error updating post:', error);
      setError('Failed to update post. Please try again.');
    }
  };

  // Data fetching
  const fetchPosts = async (pageNumber) => {
    setLoading(true);
    setError(null);
    try {
      console.log(`Fetching posts for page ${pageNumber}...`);
      const response = await getMemePosts(pageNumber);

      console.log('Full response:', response);

      if (!response) {
        console.error('Empty API response');
        throw new Error('Empty API response');
      }

      let postsArray = [];

      if (Array.isArray(response)) {
        postsArray = response;
      } else if (response.posts && Array.isArray(response.posts)) {
        postsArray = response.posts;
      } else if (response.data && Array.isArray(response.data)) {
        postsArray = response.data;
      } else if (response.data && response.data.posts && Array.isArray(response.data.posts)) {
        postsArray = response.data.posts;
      } else {
        console.error('Could not find posts array in response:', response);
        throw new Error('Posts data is not in expected format');
      }

      console.log(`Found ${postsArray.length} posts in the response`);

      if (pageNumber === 1) {
        console.log(`Setting ${postsArray.length} posts for page 1`);
        setPosts(postsArray);
      } else {
        console.log(`Adding ${postsArray.length} posts for page ${pageNumber}`);
        setPosts((prevPosts) => {
          const existingIds = new Set(prevPosts.map((post) => post.id));
          const newPosts = postsArray.filter((post) => !existingIds.has(post.id));

          return [...prevPosts, ...newPosts];
        });
      }

      if (response.currentUser) {
        setCurrentUser(response.currentUser);
      } else if (response.data && response.data.currentUser) {
        setCurrentUser(response.data.currentUser);
      }

      let hasMorePages = true;

      if (response.current_page && response.last_page) {
        hasMorePages = response.current_page < response.last_page;
      } else if (response.currentPage && response.lastPage) {
        hasMorePages = response.currentPage < response.lastPage;
      } else if (response.data && response.data.current_page && response.data.last_page) {
        hasMorePages = response.data.current_page < response.data.last_page;
      } else if (response.meta && response.meta.current_page && response.meta.last_page) {
        hasMorePages = response.meta.current_page < response.meta.last_page;
      } else if (postsArray.length === 0) {
        hasMorePages = false;
      }

      setHasMore(hasMorePages);

      console.log('Pagination info:', { hasMorePages });
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Failed to load posts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaderboard = async (period) => {
    setLeaderboardLoading(true);
    setLeaderboardError(null);
    try {
      const response = await getLeaderboard(period);
      setLeaderboard(response.leaderboard || []);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      setLeaderboardError('Failed to load leaderboard.');
      setLeaderboard([]);
    } finally {
      setLeaderboardLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(1);
    fetchLeaderboard('daily');
  }, []);

  const loadMorePosts = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      console.log(`Loading page ${nextPage}...`);
      setPage(nextPage);

      fetchPosts(nextPage)
        .then(() => {
          console.log(`Successfully loaded page ${nextPage}`);
        })
        .catch((error) => {
          console.error(`Failed to load page ${nextPage}:`, error);
          setError('Failed to load more posts. Please try again.');
        });
    }
  };

  const getPeriodFromTab = (tabIndex) => {
    switch (tabIndex) {
      case 0:
        return 'daily';
      case 1:
        return 'weekly';
      case 2:
        return 'monthly';
      default:
        return 'daily';
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    const period = getPeriodFromTab(newValue);
    fetchLeaderboard(period);
  };

  const handleMemeCreatorSave = (editedImage, memeCaption) => {
    const file = dataURLtoFile(editedImage, 'meme.png');
    setImage(file);
    setCaption(memeCaption);
    setImagePreview(editedImage);
    setShowMemeCreator(false);
  };

  const handleUserNameClick = (event, userId) => {
    event.preventDefault();
    event.stopPropagation();
    navigate(`/users/${userId}`);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'start',
        gap: 2,
        width: '100%',
        maxWidth: '100vw',
        margin: 'auto',
        px: 2,
        position: 'sticky',
        mx: 0,
        bgcolor: theme.palette.background.default,
        color: theme.palette.text.primary,
        transition: 'background-color 0.3s, color 0.3s',
        pt: 2,
      }}
    >
      {/* Left sidebar */}
      <LeftSidebar />

      {/* Center Content (Create Post + Posts) */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          maxWidth: { xs: '100%', md: '55%' },
          mt: 2,
        }}
      >
        <CreatePostCard
          currentUser={currentUser}
          caption={caption}
          setCaption={setCaption}
          imagePreview={imagePreview}
          setImagePreview={setImagePreview}
          setImage={setImage}
          showMemeCreator={showMemeCreator}
          setShowMemeCreator={setShowMemeCreator}
          handlePost={handlePost}
          handleMemeCreatorSave={handleMemeCreatorSave}
        />

        {error && (
          <Box
            sx={{
              width: '100%',
              maxWidth: '80%',
              mb: 2,
              p: 2,
              bgcolor: 'error.light',
              color: 'error.dark',
              borderRadius: 1,
            }}
          >
            <Typography>{error}</Typography>
          </Box>
        )}

        <Box sx={{ width: '100%', maxWidth: '80%' }}>
          <InfiniteScroll
            dataLength={posts.length}
            next={loadMorePosts}
            hasMore={hasMore}
            loader={
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                <CircularProgress color="primary" />
              </Box>
            }
            endMessage={
              <Box sx={{ textAlign: 'center', my: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  {"You've seen all the memes! 🎉"}
                </Typography>
              </Box>
            }
            scrollThreshold={0.9}
            style={{ overflow: 'visible' }}
          >
            {posts.map((post) => (
              <MemePost
                key={post.id}
                id={post.id}
                caption={post.caption}
                image={post.image ? post.image.image_path : null}
                timestamp={post.created_at}
                postUsers={post.user}
                loggedInUser={currentUser}
                onDelete={handleDelete}
                onReportPost={handleReportPost}
                onUpdate={handleUpdatePost}
                onMenuOpen={handleMenuOpen}
                onMenuClose={handleMenuClose}
                menuAnchor={anchorEl}
                selectedPostId={selectedPostId}
                isMenuOpen={open && selectedPostId === post.id}
                darkMode={darkMode}
                onUserNameClick={handleUserNameClick}
                postUserId={post.user_id}
              />
            ))}
          </InfiniteScroll>
        </Box>
      </Box>

      {/* Right sidebar */}
      <RightSidebar
        leaderboard={leaderboard}
        leaderboardLoading={leaderboardLoading}
        leaderboardError={leaderboardError}
        tabValue={tabValue}
        handleTabChange={handleTabChange}
        handleUserNameClick={handleUserNameClick}
      />
    </Box>
  );
}

export default MemeFeed;
