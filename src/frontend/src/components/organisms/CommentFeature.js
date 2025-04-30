import PropTypes from 'prop-types';
import React, { useRef, useState } from 'react';
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
import ReportCommentModal from 'components/molecules/ReportCommentModal';
import CommentSection from 'components/organisms/CommentSection';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import FloatingEmojiPicker from 'components/molecules/FloatingEmojiPicker';

const CommentFeature = ({
  postId,
  user,
  comments,
  isLoading,
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
}) => {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportCommentId, setReportCommentId] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiButtonRef = useRef(null);
  const textFieldRef = useRef(null);

  const handleReportClick = (commentId) => {
    setReportCommentId(commentId);
    setIsReportModalOpen(true);
  };

  const handleReportModalClose = () => {
    setIsReportModalOpen(false);
    setReportCommentId(null);
  };

  const handleEmojiClick = (emojiObject) => {
    const textField = textFieldRef.current?.querySelector('textarea');
    if (!textField) {
      // Fallback: append emoji to the end
      setTempEditingText((prev) => prev + emojiObject.emoji);
      return;
    }

    const start = textField.selectionStart;
    const end = textField.selectionEnd;
    const textBefore = tempEditingText.substring(0, start);
    const textAfter = tempEditingText.substring(end);

    // Insert emoji at cursor position
    const newText = textBefore + emojiObject.emoji + textAfter;
    setTempEditingText(newText);

    // Restore cursor position after emoji
    setTimeout(() => {
      textField.selectionStart = textField.selectionEnd = start + emojiObject.emoji.length;
    }, 0);

    setShowEmojiPicker(false);
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
        sx={{
          '& .MuiDialog-paper': {
            overflow: 'visible', // Ensure the dialog paper doesn't clip the emoji picker
          },
          '& .MuiDialog-container': {
            alignItems: 'center', // Center the dialog vertically
          },
        }}
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
        <DialogContent
          sx={{
            overflow: 'visible', // Prevent clipping of the emoji picker
            paddingBottom: 2,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              mb: 2,
              position: 'relative',
            }}
          >
            <TextField
              margin="dense"
              fullWidth
              multiline
              rows={3}
              value={tempEditingText}
              onChange={(e) => setTempEditingText(e.target.value)}
              placeholder="Edit your comment here...."
              disabled={isLoading}
              inputRef={textFieldRef}
              sx={{ pr: 5 }}
            />
            <Box sx={{ position: 'absolute', right: 8, top: 12 }}>
              <FloatingEmojiPicker
                onEmojiClick={handleEmojiClick}
                showEmojiPicker={showEmojiPicker}
                setShowEmojiPicker={setShowEmojiPicker}
                emojiButtonRef={emojiButtonRef}
              />
            </Box>
          </Box>
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

      <ReportCommentModal
        open={isReportModalOpen}
        onClose={handleReportModalClose}
        postId={postId}
        commentId={reportCommentId}
      />
    </Box>
  );
};

CommentFeature.propTypes = {
  postId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  user: PropTypes.object.isRequired,
  comments: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
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
  replyLoading: PropTypes.object.isRequired,
  setReplyToComment: PropTypes.func.isRequired,
  setTempEditingText: PropTypes.func.isRequired,
  setCommentImage: PropTypes.func.isRequired,
  setUpdateCommentImagePreview: PropTypes.func.isRequired,
  setIsUpdateModalOpen: PropTypes.func.isRequired,
  setIsDeleteModalOpen: PropTypes.func.isRequired,
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
  handleCommentReactionChange: PropTypes.func.isRequired,
};

export default CommentFeature;
