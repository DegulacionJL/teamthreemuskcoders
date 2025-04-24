// CommentFeature.js
import PropTypes from 'prop-types';
import React, { useEffect, useRef } from 'react';
import * as commentService from 'services/comment.service';
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
  Typography,
} from '@mui/material';
import ImagePreview from 'components/atoms/ImagePreview';
import ImageUploadButton from 'components/molecules/ImageUploadButton';
import CommentSection from 'components/organisms/CommentSection';
import DeleteConfirmationModal from './DeleteConfirmationModal';

const CommentFeature = ({
  postId,
  user,
  comments,
  isLoading,
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
  replyPages,
  replyLoading,
  setReplyToComment,
  setEditingCommentId,
  setEditingCommentText,
  setTempEditingText,
  setCommentImage,
  setUpdateCommentImagePreview,
  setIsUpdateModalOpen,
  setCommentToDelete,
  setIsDeleteModalOpen,
  fetchComments,
  fetchTotalCommentsCount,
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
  handleLikeComment,
  handleUnlikeComment,
  handleCommentReactionChange,
}) => {
  // Ref to track if comments have been fetched
  const hasFetchedComments = useRef(false);

  // Fetch comments when CommentFeature mounts (i.e., when the comment section is shown)
  useEffect(() => {
    if (!hasFetchedComments.current) {
      fetchComments(1);
      hasFetchedComments.current = true;
    }
  }, [fetchComments]);

  const [isReportModalOpen, setIsReportModalOpen] = React.useState(false);
  const [reportCommentId, setReportCommentId] = React.useState(null);
  const [reportReason, setReportReason] = React.useState('');
  const [reportError, setReportError] = React.useState(null);
  const [isReporting, setIsReporting] = React.useState(false);

  const handleReportClick = (commentId) => {
    setReportCommentId(commentId);
    setIsReportModalOpen(true);
  };

  const handleReportSubmit = async () => {
    if (!reportReason.trim()) {
      setReportError('Please provide a reason for reporting.');
      return;
    }

    setIsReporting(true);
    setReportError(null);

    try {
      await commentService.reportComment(postId, reportCommentId, reportReason);
      setIsReportModalOpen(false);
      setReportReason('');
      setReportCommentId(null);
    } catch (error) {
      setReportError('Failed to submit report. Please try again.');
    } finally {
      setIsReporting(false);
    }
  };

  const handleReportCancel = () => {
    setIsReportModalOpen(false);
    setReportReason('');
    setReportCommentId(null);
    setReportError(null);
  };

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
        onReactionChange={handleCommentReactionChange}
        user={user}
        onReportClick={handleReportClick}
        onLoadMoreReplies={handleLoadMoreReplies}
        replyLoading={replyLoading}
      />
      {hasMore && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
          <Button onClick={handleLoadMore} disabled={isLoading}>
            Load More
          </Button>
        </Box>
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

      <Dialog open={isReportModalOpen} onClose={handleReportCancel} maxWidth="sm" fullWidth>
        <DialogTitle>
          Report Comment
          <IconButton
            aria-label="close"
            onClick={handleReportCancel}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to report this comment? Please provide a reason.
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value)}
            placeholder="Enter your reason for reporting..."
            error={!!reportError}
            helperText={reportError}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleReportCancel} disabled={isReporting}>
            Cancel
          </Button>
          <Button
            onClick={handleReportSubmit}
            variant="contained"
            color="warning"
            disabled={isReporting}
          >
            {isReporting ? (
              <>
                <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                Reporting...
              </>
            ) : (
              'Report'
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
  comments: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  totalCommentsCount: PropTypes.number.isRequired,
  hasMore: PropTypes.bool.isRequired,
  editingCommentId: PropTypes.number,
  editingCommentText: PropTypes.string,
  tempEditingText: PropTypes.string,
  commentImage: PropTypes.any,
  updateCommentImagePreview: PropTypes.string,
  isUpdateModalOpen: PropTypes.bool.isRequired,
  replyToComment: PropTypes.any,
  commentToDelete: PropTypes.number,
  isDeleteModalOpen: PropTypes.bool.isRequired,
  replyPages: PropTypes.object.isRequired,
  replyLoading: PropTypes.object.isRequired,
  setReplyToComment: PropTypes.func.isRequired,
  setEditingCommentId: PropTypes.func.isRequired,
  setEditingCommentText: PropTypes.func.isRequired,
  setTempEditingText: PropTypes.func.isRequired,
  setCommentImage: PropTypes.func.isRequired,
  setUpdateCommentImagePreview: PropTypes.func.isRequired,
  setIsUpdateModalOpen: PropTypes.func.isRequired,
  setCommentToDelete: PropTypes.func.isRequired,
  setIsDeleteModalOpen: PropTypes.func.isRequired,
  fetchComments: PropTypes.func.isRequired,
  fetchTotalCommentsCount: PropTypes.func.isRequired,
  handleAddComment: PropTypes.func.isRequired,
  handleAddReply: PropTypes.func.isRequired,
  confirmDeleteComment: PropTypes.func.isRequired,
  handleDeleteComment: PropTypes.func.isRequired,
  handleEditCommentClick: PropTypes.func.isRequired,
  handleUpdateCommentImage: PropTypes.func.isRequired,
  handleUpdateComment: PropTypes.func.isRequired,
  handleCancelUpdateComment: PropTypes.func.isRequired,
  handleLoadMore: PropTypes.func.isRequired,
  handleLoadMoreReplies: PropTypes.func.isRequired,
  handleLikeComment: PropTypes.func.isRequired,
  handleUnlikeComment: PropTypes.func.isRequired,
  handleCommentReactionChange: PropTypes.func.isRequired,
};

export default CommentFeature;
