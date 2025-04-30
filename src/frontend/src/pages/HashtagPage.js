'use client';

import { useAuth } from 'hooks/useAuth';
import { useComments } from 'hooks/useComments';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import {
  deletePost,
  fetchPostsByHashtag,
  likePost,
  reportPost,
  unlikePost,
  updatePost,
} from 'services/meme.service';
import 'yet-another-react-lightbox/styles.css';
import { ChatBubbleOutline, MoreVert } from '@mui/icons-material';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
  Pagination,
  Paper,
  Snackbar,
  Typography,
} from '@mui/material';
import CommentFeature from 'components/organisms/CommentFeature';
import DeleteConfirmationModal from 'components/organisms/DeleteConfirmationModal';
import EditPostModal from 'components/organisms/EditPostModal';
import LightBox from 'components/organisms/LightBox';
// Adjust relative path
import ReportPostConfirmationModal from 'components/organisms/ReportPostModal';
import PostReactions from 'components/organisms/User/PostReaction';
import { useTheme as useCustomTheme } from 'theme/ThemeContext';

const HashtagPage = () => {
  const { user, isLoading: authLoading } = useAuth({ middleware: 'auth' });
  const { tag } = useParams();
  const { darkMode } = useCustomTheme();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    total: 0,
  });
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPostDeleteModalOpen, setIsPostDeleteModalOpen] = useState(false);
  const [isReportPostModalOpen, setIsReportPostModalOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);

  const safeTag = tag?.trim() || '';

  const fetchPosts = async (tagArg, page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchPostsByHashtag(tagArg, page);
      setPosts(response.posts || []);
      setPagination({
        currentPage: response.meta?.current_page || 1,
        lastPage: response.meta?.last_page || 1,
        total: response.meta?.total || 0,
      });
    } catch (err) {
      setError(`Failed to load posts: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleMenuOpen = (event, postId) => {
    setMenuAnchor(event.currentTarget);
    setSelectedPostId(postId);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedPostId(null);
  };

  const handleUpdate = async (postId, newCaption, newImage, removeImage = false) => {
    try {
      const updatedPost = await updatePost(postId, newCaption, newImage, removeImage);
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? { ...post, caption: updatedPost.caption, image: updatedPost.image }
            : post
        )
      );
      return updatedPost;
    } catch (error) {
      throw new Error('Failed to update post');
    }
  };

  const handleDelete = async (postId) => {
    try {
      await deletePost(postId);
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
    } catch (error) {
      throw new Error('Failed to delete post');
    }
  };

  const handleReportPost = async (postId) => {
    try {
      await reportPost(postId);
    } catch (error) {
      throw new Error('Failed to report post');
    }
  };

  useEffect(() => {
    if (safeTag) {
      fetchPosts(safeTag);
    }
  }, [safeTag]);

  if (authLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4 }}>
        <CircularProgress />
        <Typography variant="body2" sx={{ ml: 2 }}>
          Verifying your login...
        </Typography>
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: `/hashtag/${safeTag}` }} replace />;
  }

  return (
    <Box sx={{ p: 4 }}>
      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Posts with hashtag
        </Typography>
        <Chip
          label={`#${safeTag}`}
          color="primary"
          sx={{ ml: 2, fontSize: '1.2rem', height: 32 }}
        />
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" color="text.secondary">
          Welcome, {user.name || user.first_name || 'User'}!
          {pagination.total > 0 &&
            ` Viewing ${pagination.total} post${
              pagination.total !== 1 ? 's' : ''
            } with #${safeTag}`}
        </Typography>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4 }}>
          <CircularProgress />
          <Typography variant="body2" sx={{ ml: 2 }}>
            Loading posts with #{safeTag}...
          </Typography>
        </Box>
      ) : posts.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No posts found with hashtag #{safeTag}.
          </Typography>
          <Button variant="contained" color="primary" sx={{ mt: 3 }} href="/create-post">
            Create the first post with #{safeTag}
          </Button>
        </Box>
      ) : (
        <>
          <Box sx={{ maxWidth: 800, mx: 'auto' }}>
            {posts.map((post) => (
              <Post
                key={post.id}
                id={post.id}
                caption={post.caption}
                image={post.image?.image_path}
                timestamp={post.created_at}
                postUsers={post.user}
                loggedInUser={user}
                onUpdate={handleUpdate}
                onMenuOpen={handleMenuOpen}
                onMenuClose={handleMenuClose}
                menuAnchor={menuAnchor}
                isMenuOpen={selectedPostId === post.id && Boolean(menuAnchor)}
                onUserNameClick={(e, userId) => console.log(`Navigate to user ${userId}`)}
                postUserId={post.user?.id}
                darkMode={darkMode}
                setCurrentPost={setCurrentPost}
                setIsEditModalOpen={setIsEditModalOpen}
                setIsPostDeleteModalOpen={setIsPostDeleteModalOpen}
                setIsReportPostModalOpen={setIsReportPostModalOpen}
              />
            ))}
          </Box>

          {pagination.lastPage > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={pagination.lastPage}
                page={pagination.currentPage}
                onChange={(e, page) => fetchPosts(safeTag, page)}
                color="primary"
              />
            </Box>
          )}
        </>
      )}

      {currentPost && (
        <>
          <EditPostModal
            open={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            caption={currentPost.caption}
            image={currentPost.image}
            onSave={(newCaption, newImage, removeImage) =>
              handleUpdate(currentPost.id, newCaption, newImage, removeImage)
            }
          />
          <DeleteConfirmationModal
            open={isPostDeleteModalOpen}
            onClose={() => setIsPostDeleteModalOpen(false)}
            onConfirm={() => handleDelete(currentPost.id)}
            title="Delete Post"
            content="Are you sure you want to delete this post? This action cannot be undone."
          />
          <ReportPostConfirmationModal
            open={isReportPostModalOpen}
            onClose={() => setIsReportPostModalOpen(false)}
            onConfirm={() => handleReportPost(currentPost.id)}
            title="Report Post"
            content="Are you sure you want to report this Post? This action cannot be undone."
          />
        </>
      )}
    </Box>
  );
};

const Post = ({
  id,
  caption,
  image,
  timestamp,
  postUsers,
  loggedInUser,

  onMenuOpen,
  onMenuClose,
  menuAnchor,
  isMenuOpen,
  onUserNameClick,
  postUserId,
  darkMode,
  setCurrentPost,
  setIsEditModalOpen,
  setIsPostDeleteModalOpen,
  setIsReportPostModalOpen,
}) => {
  const { user } = useAuth({ middleware: 'auth' });
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [reactionType, setReactionType] = useState(null);
  const [likeCount, setLikeCount] = useState(0);
  const [currentCaption] = useState(caption);
  const [currentImage, setCurrentImage] = useState(image);

  const {
    comments,
    isLoading: commentsLoading,
    totalCommentsCount,
    hasMore,
    editingCommentId,
    editingCommentText,
    tempEditingText,
    commentImage,
    updateCommentImagePreview,
    isUpdateModalOpen,
    replyToComment,
    commentToDelete,
    isDeleteModalOpen,
    replyLoading,
    hasFetchedComments,
    setReplyToComment,
    setTempEditingText,
    setCommentImage,
    setUpdateCommentImagePreview,
    setIsUpdateModalOpen,
    setIsDeleteModalOpen,
    fetchComments,
    handleAddComment,
    handleAddReply,
    confirmDeleteComment,
    handleDeleteComment,
    handleEditCommentClick,
    handleUpdateCommentImage,
    handleUpdateComment,
    handleCancelUpdateComment,
    handleLoadMore,
    handleLoadMoreReplies,
    handleCommentReactionChange,
  } = useComments(id);

  useEffect(() => {
    const savedReaction = localStorage.getItem(`post_reaction_${id}`);
    const savedLikeCount = localStorage.getItem(`post_like_count_${id}`);

    if (savedReaction) {
      setReactionType(savedReaction);
    }

    if (savedLikeCount) {
      setLikeCount(Number.parseInt(savedLikeCount, 10));
    } else {
      setLikeCount(0);
    }
  }, [id]);

  useEffect(() => {
    setCurrentImage(image);
  }, [image]);

  const handleReactionChange = useCallback(async (postId, hasReacted, newReactionType, count) => {
    try {
      if (hasReacted) {
        await unlikePost(postId);
      } else {
        await likePost(postId);
      }
      setLikeCount(count);
      setReactionType(newReactionType);

      if (hasReacted && newReactionType) {
        localStorage.setItem(`post_reaction_${postId}`, newReactionType);
      } else {
        localStorage.removeItem(`post_reaction_${postId}`);
      }
      localStorage.setItem(`post_like_count_${postId}`, count.toString());
    } catch (error) {
      console.error('Error toggling reaction:', error);
    }
  }, []);

  const handleToggleComments = useCallback(() => {
    setShowComments((prev) => {
      const newShowComments = !prev;
      if (newShowComments && !hasFetchedComments) {
        fetchComments(1);
      }
      return newShowComments;
    });
  }, [hasFetchedComments, fetchComments]);

  const handleImageClick = () => {
    if (currentImage) {
      setIsLightboxOpen(true);
    }
  };

  const getRelativeTime = (timestamp) => {
    const now = new Date();
    const postedTime = new Date(timestamp);
    const diff = Math.floor((now - postedTime) / 1000);

    if (diff < 60) return 'Just now';
    if (diff < 3600) {
      const minutes = Math.floor(diff / 60);
      return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
    }
    if (diff < 86400) {
      const hours = Math.floor(diff / 3600);
      return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    }
    const days = Math.floor(diff / 86400);
    return `${days} day${days === 1 ? '' : 's'} ago`;
  };

  const formatCaption = (text) => {
    if (!text) return '';

    const formattedText = text.split('\n').map((line, i, arr) => (
      <React.Fragment key={i}>
        {line}
        {i < arr.length - 1 && <br />}
      </React.Fragment>
    ));

    return (
      <Typography
        variant="body1"
        component="div"
        sx={{
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        {formattedText}
      </Typography>
    );
  };

  return (
    <Paper
      sx={{
        mb: 3,
        borderRadius: 1,
        overflow: 'visible',
        backgroundColor: 'background.paper',
        maxWidth: '800px',
        width: '100%',
        mx: 'auto',
        position: 'relative',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
        <Avatar
          src={postUsers?.avatar || ''}
          alt={`${postUsers?.first_name} ${postUsers?.last_name}`}
          sx={{
            bgcolor: darkMode ? '#4a3b6b' : 'primary.light',
            mr: 1.5,
          }}
        >
          {postUsers
            ? `${postUsers.first_name?.charAt(0) || ''}${postUsers.last_name?.charAt(0) || ''}`
            : 'U'}
        </Avatar>
        <Box>
          <Typography
            variant="subtitle1"
            fontWeight="medium"
            onClick={(e) =>
              postUsers?.id && onUserNameClick ? onUserNameClick(e, postUsers.id) : null
            }
            sx={{
              cursor: postUsers?.id && onUserNameClick ? 'pointer' : 'default',
              color: darkMode ? '#ffffff' : '#000000',
              '&:hover':
                postUsers?.id && onUserNameClick
                  ? {
                      textDecoration: 'underline',
                      color: darkMode ? 'primary.main' : 'primary.dark',
                    }
                  : {},
            }}
          >
            {postUsers
              ? `${
                  postUsers.first_name?.charAt(0).toUpperCase() + postUsers.first_name?.slice(1)
                } ${postUsers.last_name?.charAt(0).toUpperCase() + postUsers.last_name?.slice(1)}`
              : 'Unknown User'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {getRelativeTime(timestamp)}
          </Typography>
        </Box>
        <IconButton
          onClick={(event) => {
            setCurrentPost({ id, caption, image });
            onMenuOpen(event, id);
          }}
          sx={{ ml: 'auto' }}
        >
          <MoreVert />
        </IconButton>
      </Box>

      <Menu anchorEl={menuAnchor} open={isMenuOpen} onClose={onMenuClose}>
        {postUserId && postUserId === user.id
          ? [
              <MenuItem
                key="edit"
                onClick={() => {
                  setCurrentPost({ id, caption, image });
                  setIsEditModalOpen(true);
                }}
              >
                Edit
              </MenuItem>,
              <MenuItem
                key="delete"
                onClick={() => {
                  setCurrentPost({ id, caption, image });
                  setIsPostDeleteModalOpen(true);
                }}
                sx={{ color: 'red' }}
              >
                Delete
              </MenuItem>,
              <MenuItem
                key="report"
                onClick={() => {
                  setCurrentPost({ id, caption, image });
                  setIsReportPostModalOpen(true);
                }}
              >
                Report
              </MenuItem>,
            ]
          : [
              <MenuItem
                key="report"
                onClick={() => {
                  setCurrentPost({ id, caption, image });
                  setIsReportPostModalOpen(true);
                }}
              >
                Report
              </MenuItem>,
            ]}
      </Menu>

      <Box sx={{ px: 2, pb: 1, pt: 0 }}>
        <Box sx={{ mb: 2, mt: 2 }}>{formatCaption(currentCaption)}</Box>
      </Box>

      {currentImage && (
        <Box
          component="img"
          src={currentImage}
          alt="Meme"
          onClick={handleImageClick}
          sx={{
            width: '100%',
            maxHeight: 500,
            objectFit: 'contain',
            bgcolor: darkMode ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.03)',
            cursor: 'pointer',
            display: 'block',
          }}
        />
      )}

      <LightBox
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        image={currentImage}
        caption={currentCaption}
        user={postUsers}
        timestamp={timestamp}
        comments={comments}
        reactionCount={likeCount}
        onAddComment={handleAddComment}
        darkMode={darkMode}
      />

      <Box sx={{ p: 2, display: 'flex', gap: 2 }}>
        <PostReactions
          postId={id}
          isDarkMode={darkMode}
          onReactionChange={handleReactionChange}
          initialReactionType={reactionType}
        />
        <Button
          startIcon={<ChatBubbleOutline />}
          size="small"
          onClick={handleToggleComments}
          sx={{ color: 'text.secondary' }}
        >
          Comments {totalCommentsCount > 0 && `(${totalCommentsCount})`}
        </Button>
      </Box>

      <Box
        sx={{
          px: 2,
          pb: 0,
          mt: 0,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {likeCount > 0 && (
          <Typography
            variant="caption"
            sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', py: 0 }}
          >
            <span
              role="img"
              aria-label="laughing emoji"
              style={{ marginRight: '4px', fontSize: '16px' }}
            >
              😂
            </span>
            {likeCount}
          </Typography>
        )}
      </Box>

      {showComments && (
        <CommentFeature
          postId={id}
          user={loggedInUser}
          comments={comments}
          isLoading={commentsLoading}
          hasMore={hasMore}
          editingCommentId={editingCommentId}
          editingCommentText={editingCommentText}
          tempEditingText={tempEditingText}
          commentImage={commentImage}
          updateCommentImagePreview={updateCommentImagePreview}
          isUpdateModalOpen={isUpdateModalOpen}
          replyToComment={replyToComment}
          commentToDelete={commentToDelete}
          isDeleteModalOpen={isDeleteModalOpen}
          replyLoading={replyLoading}
          setReplyToComment={setReplyToComment}
          setTempEditingText={setTempEditingText}
          setCommentImage={setCommentImage}
          setUpdateCommentImagePreview={setUpdateCommentImagePreview}
          setIsUpdateModalOpen={setIsUpdateModalOpen}
          setIsDeleteModalOpen={setIsDeleteModalOpen}
          handleAddComment={handleAddComment}
          handleAddReply={handleAddReply}
          confirmDeleteComment={confirmDeleteComment}
          handleDeleteComment={handleDeleteComment}
          handleEditCommentClick={handleEditCommentClick}
          handleUpdateCommentImage={handleUpdateCommentImage}
          handleUpdateComment={handleUpdateComment}
          handleCancelUpdateComment={handleCancelUpdateComment}
          handleLoadMore={handleLoadMore}
          handleLoadMoreReplies={handleLoadMoreReplies}
          handleCommentReactionChange={handleCommentReactionChange}
        />
      )}
    </Paper>
  );
};

Post.propTypes = {
  id: PropTypes.number.isRequired,
  caption: PropTypes.string,
  image: PropTypes.string,
  timestamp: PropTypes.string,
  postUsers: PropTypes.shape({
    id: PropTypes.number,
    avatar: PropTypes.string,
    first_name: PropTypes.string,
    last_name: PropTypes.string,
  }),
  loggedInUser: PropTypes.object,
  onUpdate: PropTypes.func,
  onMenuOpen: PropTypes.func,
  onMenuClose: PropTypes.func,
  menuAnchor: PropTypes.any,
  isMenuOpen: PropTypes.bool,
  onUserNameClick: PropTypes.func,
  postUserId: PropTypes.number,
  darkMode: PropTypes.bool,
  setCurrentPost: PropTypes.func,
  setIsEditModalOpen: PropTypes.func,
  setIsPostDeleteModalOpen: PropTypes.func,
  setIsReportPostModalOpen: PropTypes.func,
};

export default HashtagPage;
