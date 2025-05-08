import PropTypes from 'prop-types';
import { useState } from 'react';
import { ChatBubbleOutline as CommentIcon, MoreVert as MoreVertIcon } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import { getRelativeTime } from 'utils/timeUtils';
import { useComments } from 'hooks/useComments';
import PostReaction from 'components/organisms/User/PostReaction';
import CommentFeature from 'components/organisms/CommentFeature';

const PostCard = ({ post, loggedInUser }) => {
  const [showComments, setShowComments] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  // Comments and reactions logic from useComments
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
    setReplyToComment,
    setTempEditingText,
    setCommentImage,
    setUpdateCommentImagePreview,
    setIsUpdateModalOpen,
    setIsDeleteModalOpen,
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
    fetchComments,
  } = useComments(post.id);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleToggleComments = () => {
    setShowComments((prev) => {
      const newShow = !prev;
      if (newShow && comments.length === 0) {
        fetchComments(1);
      }
      return newShow;
    });
  };

  return (
    <Card sx={{ mb: 3, borderRadius: 2, overflow: 'visible' }}>
      <CardHeader
        avatar={
          <Avatar
            src={post.user?.avatar || '/placeholder.svg?height=40&width=40'}
            alt={post.user?.name}
          />
        }
        action={
          <IconButton aria-label="settings" onClick={handleMenuOpen}>
            <MoreVertIcon />
          </IconButton>
        }
        title={
          <Typography variant="subtitle1" fontWeight="medium">
            {post.user?.name || 'Unknown User'}
          </Typography>
        }
        subheader={
          <Typography variant="caption" color="text.secondary">
            {post.created_at ? getRelativeTime(post.created_at) : 'Unknown time'}
          </Typography>
        }
      />

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleMenuClose}>Save Post</MenuItem>
        <MenuItem onClick={handleMenuClose}>Report Post</MenuItem>
        {post.is_own_post && <MenuItem onClick={handleMenuClose}>Delete Post</MenuItem>}
      </Menu>

      <CardContent sx={{ pt: 0 }}>
        <Typography variant="body1" sx={{ mb: post.image ? 2 : 0 }}>
          {post.caption}
        </Typography>
      </CardContent>

      {post.image && (
        <CardMedia
          component="img"
          image={post.image}
          alt="Post image"
          sx={{ maxHeight: 500, objectFit: 'contain' }}
        />
      )}

      {/* Engagement Stats */}
      <Box sx={{ px: 2, py: 1, display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="body2" color="text.secondary">
          {/* Like count will be handled by PostReaction */}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {totalCommentsCount > 0 && (
            <>
              {totalCommentsCount} {totalCommentsCount === 1 ? 'comment' : 'comments'}
            </>
          )}
        </Typography>
      </Box>

      <Divider />

      <CardActions sx={{ justifyContent: 'space-around', px: 2 }}>
        <PostReaction postId={post.id} />
        <Button
          startIcon={<CommentIcon />}
          onClick={handleToggleComments}
          sx={{ color: 'text.secondary', textTransform: 'none' }}
        >
          Comment{totalCommentsCount > 0 ? ` (${totalCommentsCount})` : ''}
        </Button>
      </CardActions>

      {/* Comments Section */}
      {showComments && (
        <Box sx={{ p: 2, pt: 0 }}>
          <Divider sx={{ my: 1 }} />
          <CommentFeature
            postId={post.id}
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
        </Box>
      )}
    </Card>
  );
};

PostCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.number.isRequired,
    liked: PropTypes.bool,
    likes_count: PropTypes.number,
    comments: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        user: PropTypes.shape({
          id: PropTypes.number,
          name: PropTypes.string,
          avatar: PropTypes.string,
        }),
        text: PropTypes.string,
        created_at: PropTypes.string,
      })
    ),
    user: PropTypes.shape({
      avatar: PropTypes.string,
      name: PropTypes.string,
    }),
    created_at: PropTypes.string,
    is_own_post: PropTypes.bool,
    image: PropTypes.string,
    caption: PropTypes.string,
  }).isRequired,
  loggedInUser: PropTypes.object.isRequired,
};

export default PostCard;
