import { autoUpdate, flip, offset, shift, useFloating } from '@floating-ui/react';
import EmojiPicker from 'emoji-picker-react';
import PropTypes from 'prop-types';
import React, { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import { Avatar, Box, Button, IconButton, InputAdornment, TextField } from '@mui/material';
import ImagePreview from 'components/atoms/ImagePreview';
import CommentsList from 'components/molecules/CommentsList';
import ImageUploadButton from 'components/molecules/ImageUploadButton';

const CommentSection = ({
  comments,
  onAddComment,
  replyToComment,
  onReplyClick,
  onCancelReply,
  onAddReply,
  onEditClick,
  onDeleteClick,
  editingCommentId,
  editingCommentText,
  onLoadMoreReplies,
  onBackReplies,
  replyHasMore,
  replyPage,
  onReactionChange,
  user: propUser,
}) => {
  const [newCommentText, setNewCommentText] = useState('');
  const [newCommentImage, setNewCommentImage] = useState(null);
  const [newCommentImagePreview, setNewCommentImagePreview] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const reduxUser = useSelector((state) => state.profile.user);
  const currentUser = propUser || reduxUser;

  const emojiButtonRef = useRef(null);

  const { refs, floatingStyles } = useFloating({
    open: showEmojiPicker,
    placement: 'bottom-end',
    middleware: [offset(12), flip(), shift({ padding: 12 })],
    whileElementsMounted: autoUpdate,
    elements: { reference: emojiButtonRef.current },
  });

  const handleAddComment = () => {
    if (!newCommentText.trim() && !newCommentImage) return;
    onAddComment(newCommentText, newCommentImage);
    setNewCommentText('');
    setNewCommentImage(null);
    setNewCommentImagePreview(null);
  };

  const handleImageUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewCommentImage(file);
      setNewCommentImagePreview(URL.createObjectURL(file));
    }
  };

  const handleEmojiClick = (emojiObject) => {
    setNewCommentText((prev) => prev + emojiObject.emoji);
  };

  return (
    <Box sx={{ mt: 2, px: 2, position: 'relative', zIndex: 1 }}>
      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: 2, mb: 2 }}>
        <Avatar
          src={currentUser?.avatar || ''}
          alt={`${currentUser?.first_name} ${currentUser?.last_name}`}
          sx={{ bgcolor: currentUser?.avatar ? 'transparent' : '#4a3b6b', width: 40, height: 40 }}
        >
          {currentUser
            ? `${currentUser.first_name?.charAt(0) || ''}${currentUser.last_name?.charAt(0) || ''}`
            : 'U'}
        </Avatar>
        <Box sx={{ flexGrow: 1, position: 'relative' }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Add a comment..."
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            sx={{ mb: 1 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    ref={emojiButtonRef}
                    onClick={() => setShowEmojiPicker((prev) => !prev)}
                    edge="end"
                  >
                    <EmojiEmotionsIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {showEmojiPicker && (
            <Box
              ref={refs.setFloating}
              style={{ ...floatingStyles, zIndex: 1500, position: 'absolute' }}
              sx={{
                '& .emoji-picker-react': {
                  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
                  borderRadius: 8,
                  overflow: 'visible',
                },
              }}
            >
              <EmojiPicker onEmojiClick={handleEmojiClick} />
            </Box>
          )}
          {newCommentImagePreview && (
            <ImagePreview
              src={newCommentImagePreview}
              onRemove={() => {
                setNewCommentImage(null);
                setNewCommentImagePreview(null);
              }}
              maxHeight="100px"
            />
          )}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <ImageUploadButton
              onChange={handleImageUpload}
              id="new-comment-image"
              buttonVariant="button"
              buttonText="Add Image"
            />
            <Button variant="contained" onClick={handleAddComment}>
              Post
            </Button>
          </Box>
        </Box>
      </Box>
      <CommentsList
        comments={comments}
        replyToComment={replyToComment}
        onReplyClick={onReplyClick}
        onCancelReply={onCancelReply}
        onAddReply={onAddReply}
        onEditClick={onEditClick}
        onDeleteClick={onDeleteClick}
        editingCommentId={editingCommentId}
        editingCommentText={editingCommentText}
        onLoadMoreReplies={onLoadMoreReplies}
        onBackReplies={onBackReplies}
        replyHasMore={replyHasMore}
        replyPage={replyPage}
        onReactionChange={onReactionChange}
      />
    </Box>
  );
};

CommentSection.propTypes = {
  comments: PropTypes.array.isRequired,
  onAddComment: PropTypes.func.isRequired,
  replyToComment: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onReplyClick: PropTypes.func.isRequired,
  onCancelReply: PropTypes.func.isRequired,
  onAddReply: PropTypes.func.isRequired,
  onEditClick: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
  editingCommentId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  editingCommentText: PropTypes.string,
  onLoadMoreReplies: PropTypes.func.isRequired,
  onBackReplies: PropTypes.func.isRequired,
  replyHasMore: PropTypes.object.isRequired,
  replyPage: PropTypes.object.isRequired,
  onReactionChange: PropTypes.func.isRequired,
  user: PropTypes.object,
};

export default CommentSection;
