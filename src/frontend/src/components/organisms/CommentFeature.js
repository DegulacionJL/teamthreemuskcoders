import { useComments } from 'hooks/useComments';
import PropTypes from 'prop-types';
import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from '@mui/material';
import ImagePreview from 'components/atoms/ImagePreview';
import ImageUploadButton from 'components/molecules/ImageUploadButton';
import CommentSection from 'components/organisms/CommentSection';
import DeleteConfirmationModal from './DeleteConfirmationModal';

const CommentFeature = ({ postId, user }) => {
  const {
    comments,
    isLoading,
    totalCommentsCount,
    hasMore,
    replyToComment,
    replyPage,
    replyHasMore,
    editingCommentId,
    editingCommentText,
    tempEditingText,
    commentImage,
    updateCommentImagePreview,
    isUpdateModalOpen,
    showComments,
    commentToDelete,
    isDeleteModalOpen,
    setShowComments,
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
    handleBackReplies,
    handleCommentReactionChange,
  } = useComments(postId);

  // Find the comment being deleted to display its text (optional enhancement)
  const deletingComment = comments.find((c) => c.id === commentToDelete) || {};

  return (
    <Box sx={{ position: 'relative' }}>
      {isLoading && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            zIndex: 100,
          }}
        >
          <CircularProgress />
        </Box>
      )}

      <Button onClick={() => setShowComments(!showComments)} sx={{ mb: 2 }}>
        {showComments ? 'Hide' : 'Show'} Comments ({totalCommentsCount})
      </Button>

      {showComments && (
        <>
          <CommentSection
            comments={comments}
            onAddComment={handleAddComment}
            replyToComment={replyToComment}
            onReplyClick={setReplyToComment}
            onCancelReply={() => setReplyToComment(null)}
            onAddReply={handleAddReply}
            onEditClick={handleEditCommentClick}
            onDeleteClick={confirmDeleteComment}
            editingCommentId={editingCommentId}
            editingCommentText={editingCommentText}
            onLoadMoreReplies={handleLoadMoreReplies}
            onBackReplies={handleBackReplies}
            replyHasMore={replyHasMore}
            replyPage={replyPage}
            onReactionChange={handleCommentReactionChange}
            user={user}
          />
          {hasMore && (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
              <Button onClick={handleLoadMore} disabled={isLoading}>
                Load More
              </Button>
            </Box>
          )}
        </>
      )}

      <DeleteConfirmationModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteComment}
        title="Delete Comment"
        content={`Are you sure you want to delete this comment${
          deletingComment.text ? `: "${deletingComment.text}"` : ''
        }? This action cannot be undone.`}
      />

      <Dialog
        open={isUpdateModalOpen}
        onClose={handleCancelUpdateComment}
        maxWidth="sm"
        fullWidth
        disableAutoFocus
        disableEnforceFocus
      >
        <DialogTitle>
          Edit Comment
          <IconButton
            aria-label="close"
            onClick={() => setIsUpdateModalOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            fullWidth
            multiline
            rows={3}
            value={tempEditingText}
            onChange={(e) => setTempEditingText(e.target.value)}
            placeholder="Edit your comment here...."
            sx={{ mb: 2 }}
            disabled={isLoading}
          />
          {updateCommentImagePreview && (
            <Box sx={{ mb: 2 }}>
              <ImagePreview
                src={updateCommentImagePreview}
                onRemove={() => {
                  setUpdateCommentImagePreview(null);
                  setCommentImage(null);
                }}
                maxHeight="150px"
              />
            </Box>
          )}
          {/* Only show upload button if no new image is staged */}
          {!updateCommentImagePreview && !commentImage && (
            <Box sx={{ mb: 2 }}>
              <ImageUploadButton
                onChange={handleUpdateCommentImage}
                id="update-comment-image"
                buttonVariant="button"
                buttonText="Add Image"
                buttonProps={{ disabled: isLoading }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelUpdateComment} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleUpdateComment} variant="contained" disabled={isLoading}>
            {isLoading ? (
              <>
                <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                Updating...
              </>
            ) : (
              'Update'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

CommentFeature.propTypes = {
  postId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  user: PropTypes.object.isRequired,
};

export default CommentFeature;
