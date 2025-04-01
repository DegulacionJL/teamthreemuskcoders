// CommentSection.js
import { autoUpdate, flip, offset, shift, useFloating } from '@floating-ui/react';
import EmojiPicker from 'emoji-picker-react';
import PropTypes from 'prop-types';
import React, { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import { Avatar, Box, Button, IconButton, InputAdornment, TextField } from '@mui/material';
import ImagePreview from '../atoms/ImagePreview';
import ImageUploadButton from '../molecules/ImageUploadButton';
import CommentsList from './CommentsList';

function CommentSection({
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
  onEditingTextChange,
}) {
  const [newCommentText, setNewCommentText] = useState('');
  const [newCommentImage, setNewCommentImage] = useState(null);
  const [newCommentImagePreview, setNewCommentImagePreview] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const emojiButtonRef = useRef(null);
  const user = useSelector((state) => state.profile.user);

  const { refs, floatingStyles } = useFloating({
    open: showEmojiPicker,
    placement: 'bottom-end',
    middleware: [offset(4), flip(), shift()],
    whileElementsMounted: autoUpdate,
    elements: {
      reference: emojiButtonRef.current,
    },
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
    setNewCommentText((prevText) => prevText + emojiObject.emoji);
  };

  return (
    <Box sx={{ mt: 2, px: 2 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start',
          gap: 2, // Adds space between avatar and text field
          mb: 2,
        }}
      >
        <Avatar
          src={user?.avatar || ''}
          alt={`${user?.first_name} ${user?.last_name}`}
          sx={{
            bgcolor: user?.avatar ? 'transparent' : '#4a3b6b',
            width: 40, // Consistent size with TextField
            height: 40,
          }}
        >
          {user ? `${user.first_name?.charAt(0) || ''}${user.last_name?.charAt(0) || ''}` : 'U'}
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
              style={{
                ...floatingStyles,
                zIndex: 10,
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
              buttonVariant="text"
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
        onEditingTextChange={onEditingTextChange}
      />
    </Box>
  );
}

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
  onEditingTextChange: PropTypes.func.isRequired,
};

export default CommentSection;
