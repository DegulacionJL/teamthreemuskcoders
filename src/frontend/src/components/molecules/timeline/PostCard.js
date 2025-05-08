import { useComments } from 'hooks/useComments';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { deletePost, reportPost, updatePost } from 'services/meme.service';
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
import CommentFeature from 'components/organisms/CommentFeature';
import DeleteConfirmationModal from 'components/organisms/DeleteConfirmationModal';
import EditPostModal from 'components/organisms/EditPostModal';
import LightBox from 'components/organisms/LightBox';
import ReportPostConfirmationModal from 'components/organisms/ReportPostModal';
import PostReaction from 'components/organisms/User/PostReaction';
import { getRelativeTime } from 'utils/timeUtils';

const PostCard = ({ post, loggedInUser }) => {
  const [showComments, setShowComments] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentCaption, setCurrentCaption] = useState(post.caption);
  const [currentImage, setCurrentImage] = useState(post.image);
  const [isPostDeleteModalOpen, setIsPostDeleteModalOpen] = useState(false);
  const [isReportPostModalOpen, setIsReportPostModalOpen] = useState(false);
  const [reactionType, setReactionType] = useState(null);
  const [likeCount, setLikeCount] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

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
  } = useComments(post.id);

  useEffect(() => {
    const savedReaction = localStorage.getItem(`post_reaction_${post.id}`);
    const savedLikeCount = localStorage.getItem(`post_like_count_${post.id}`);

    if (savedReaction) {
      setReactionType(savedReaction);
    }

    if (savedLikeCount) {
      setLikeCount(Number.parseInt(savedLikeCount, 10));
    } else {
      setLikeCount(5);
    }
  }, [post.id]);

  useEffect(() => {
    setCurrentImage(post.image);
  }, [post.image]);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

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

  const handleReactionChange = useCallback((postId, hasReacted, newReactionType, count) => {
    setLikeCount(count);
    setReactionType(newReactionType);

    if (hasReacted && newReactionType) {
      localStorage.setItem(`post_reaction_${postId}`, newReactionType);
    } else {
      localStorage.removeItem(`post_reaction_${postId}`);
    }
    localStorage.setItem(`post_like_count_${postId}`, count.toString());
  }, []);

  const handleSave = async (newCaption, newImage, removeImage = false) => {
    try {
      await updatePost(post.id, { caption: newCaption });
      setCurrentCaption(newCaption);
      if (newImage) {
        setCurrentImage(newImage);
      } else if (removeImage) {
        setCurrentImage(null);
      }
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await deletePost(post.id);
      setIsPostDeleteModalOpen(false);
      // You might want to add a callback to refresh the posts list
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleConfirmReportPost = async () => {
    try {
      await reportPost(post.id);
      setIsReportPostModalOpen(false);
    } catch (error) {
      console.error('Error reporting post:', error);
    }
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
        {post.is_own_post ? (
          <>
            <MenuItem onClick={() => setIsEditModalOpen(true)}>Edit</MenuItem>
            <MenuItem onClick={() => setIsPostDeleteModalOpen(true)} sx={{ color: 'red' }}>
              Delete
            </MenuItem>
          </>
        ) : (
          <MenuItem onClick={() => setIsReportPostModalOpen(true)}>Report</MenuItem>
        )}
      </Menu>

      <CardContent sx={{ pt: 0 }}>
        <Box sx={{ mb: 2, mt: 2 }}>{formatCaption(currentCaption)}</Box>
      </CardContent>

      {currentImage && (
        <CardMedia
          component="img"
          image={currentImage}
          alt="Post image"
          onClick={handleImageClick}
          sx={{ maxHeight: 500, objectFit: 'contain', cursor: 'pointer' }}
        />
      )}

      <LightBox
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        image={currentImage}
        caption={currentCaption}
        user={post.user}
        timestamp={post.created_at}
        postId={post.id}
        onReactionChange={handleReactionChange}
        initialReactionType={reactionType}
        initialReactionCount={likeCount}
      />

      <Box sx={{ px: 2, py: 1, display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="body2" color="text.secondary">
          {likeCount > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <span role="img" aria-label="laughing emoji" style={{ marginRight: '4px' }}>
                😂
              </span>
              {likeCount}
            </Box>
          )}
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
        <PostReaction
          postId={post.id}
          onReactionChange={handleReactionChange}
          initialReactionType={reactionType}
        />
        <Button
          startIcon={<CommentIcon />}
          onClick={handleToggleComments}
          sx={{ color: 'text.secondary', textTransform: 'none' }}
        >
          Comment{totalCommentsCount > 0 ? ` (${totalCommentsCount})` : ''}
        </Button>
      </CardActions>

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

      <EditPostModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        caption={currentCaption}
        image={currentImage}
        onSave={handleSave}
      />

      <ReportPostConfirmationModal
        open={isReportPostModalOpen}
        onClose={() => setIsReportPostModalOpen(false)}
        onConfirm={handleConfirmReportPost}
        title="Report Post"
        content="Are you sure you want to report this Post? This action cannot be undone."
      />

      <DeleteConfirmationModal
        open={isPostDeleteModalOpen}
        onClose={() => setIsPostDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Post"
        content="Are you sure you want to delete this post? This action cannot be undone."
      />
    </Card>
  );
};

PostCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.number.isRequired,
    liked: PropTypes.bool,
    likes_count: PropTypes.number,
    user: PropTypes.shape({
      id: PropTypes.number,
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
