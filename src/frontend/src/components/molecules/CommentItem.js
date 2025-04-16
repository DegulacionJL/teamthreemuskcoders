import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { Box, Button, Typography, useTheme } from '@mui/material';
import AvatarWithInitials from 'components/atoms/AvatarWithInitial';
import ImagePreview from 'components/atoms/ImagePreview';
import CommentActions from 'components/molecules/CommentActions';
import ReplyForm from 'components/molecules/ReplyForm';
import CommentReactions from 'components/organisms/User/CommentReactions';

const CommentItem = ({
  comment,
  depth = 0,
  replyToComment,
  onReplyClick,
  onCancelReply,
  onAddReply,
  onEditClick,
  onDeleteClick,
  editingCommentId,
  editingCommentText,
  maxDepth = Infinity,
  onLoadMoreReplies,
  onBackReplies,
  replyHasMore,
  replyPage,
  onReactionChange,
  currentUser,
}) => {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const isMaxDepthReached = depth >= maxDepth;
  const hasMoreReplies = !!replyHasMore[comment.id];
  const currentReplyPage = replyPage[comment.id] || 1;
  const navigate = useNavigate();
  const theme = useTheme();

  const handleLoadMore = () => onLoadMoreReplies && onLoadMoreReplies(comment.id);
  const handleBack = () => onBackReplies && currentReplyPage > 1 && onBackReplies(comment.id);

  // Function to handle author click
  const handleAuthorClick = () => {
    if (comment.user?.id) {
      navigate(`/users/${comment.user.id}`);
    }
  };

  // Function to format the comment text, preserving new lines, spaces, and indentation
  const formatCommentText = (text) => {
    if (!text) return null;

    const formattedText = text.split('\n').map((line, index, arr) => (
      <React.Fragment key={index}>
        {line}
        {index < arr.length - 1 && <br />}
      </React.Fragment>
    ));

    return (
      <Typography
        variant="body2"
        component="div"
        sx={{
          mt: 0.5,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        {formattedText}
      </Typography>
    );
  };

  // Function to open lightbox with debugging
  const handleImageClick = () => {
    console.log('Image clicked, opening lightbox'); // Debug log
    setIsLightboxOpen(true);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        mt: 2,
        pb: 2,
        borderBottom: '1px solid #eee',
        ml: Math.min(depth * 2, 12),
        width: `calc(100% - ${Math.min(depth * 2, 12)}px)`,
      }}
      data-depth={depth}
    >
      <AvatarWithInitials user={comment.user} sx={{ mr: 1, width: 32, height: 32 }} />
      <Box sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 'bold',
              cursor: comment.user?.id ? 'pointer' : 'default',
              '&:hover': comment.user?.id
                ? {
                    textDecoration: 'underline',
                    color: theme.palette.primary.main,
                  }
                : {},
            }}
            onClick={handleAuthorClick}
          >
            {comment.user?.full_name || 'Unknown User'}
          </Typography>
          <Typography variant="caption" color="gray">
            {comment.timestamp || comment.created_at}
          </Typography>
        </Box>

        {comment.text && formatCommentText(comment.text)}
        {comment.image && (
          <Box sx={{ mt: 1 }}>
            {/* Wrap ImagePreview in a clickable Box to ensure clickability */}
            <Box
              onClick={handleImageClick}
              sx={{
                cursor: 'pointer',
                display: 'inline-block',
              }}
            >
              <ImagePreview
                src={comment.image}
                maxHeight="200px"
                showRemoveButton={false}
                onClick={handleImageClick}
              />
            </Box>
            <Lightbox
              open={isLightboxOpen}
              close={() => {
                console.log('Closing lightbox'); // Debug log
                setIsLightboxOpen(false);
              }}
              slides={[{ src: comment.image }]}
              render={{
                buttonPrev: () => null,
                buttonNext: () => null,
              }}
              styles={{
                root: { zIndex: 2000 }, // Ensure lightbox appears above other elements
              }}
            />
          </Box>
        )}

        <Box sx={{ mt: 1, display: 'flex', gap: 1, alignItems: 'center' }}>
          <CommentReactions
            commentId={comment.id}
            isDarkMode={false}
            onReactionChange={onReactionChange}
            initialReactionType={comment.reactionType}
          />
          {replyToComment !== comment.id && !isMaxDepthReached && (
            <Button
              size="small"
              sx={{ textTransform: 'none' }}
              onClick={() => onReplyClick(comment.id)}
            >
              Reply
            </Button>
          )}
        </Box>

        {replyToComment === comment.id && !isMaxDepthReached && (
          <ReplyForm commentId={comment.id} onSubmit={onAddReply} onCancel={onCancelReply} />
        )}

        {comment.replies?.length > 0 && (
          <Box sx={{ mt: 2, pl: 4, borderLeft: '2px solid #ddd' }}>
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                depth={depth + 1}
                replyToComment={replyToComment}
                onReplyClick={onReplyClick}
                onCancelReply={onCancelReply}
                onAddReply={onAddReply}
                onEditClick={onEditClick}
                onDeleteClick={onDeleteClick}
                editingCommentId={editingCommentId}
                editingCommentText={editingCommentText}
                maxDepth={maxDepth}
                onLoadMoreReplies={onLoadMoreReplies}
                onBackReplies={onBackReplies}
                replyHasMore={replyHasMore}
                replyPage={replyPage}
                onReactionChange={onReactionChange}
                currentUser={currentUser}
              />
            ))}
            {(hasMoreReplies || currentReplyPage > 1) && (
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 1 }}>
                {currentReplyPage > 1 && <Button onClick={handleBack}>Back</Button>}
                {hasMoreReplies && <Button onClick={handleLoadMore}>Load More</Button>}
              </Box>
            )}
          </Box>
        )}
      </Box>
      <Box sx={{ width: '40px', flexShrink: 0, display: 'flex', justifyContent: 'flex-end' }}>
        {currentUser && comment.user?.id === currentUser.id && (
          <CommentActions
            onEdit={() => onEditClick(comment)}
            onDelete={() => onDeleteClick(comment.id)}
          />
        )}
      </Box>
    </Box>
  );
};

CommentItem.propTypes = {
  comment: PropTypes.object.isRequired,
  depth: PropTypes.number,
  replyToComment: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onReplyClick: PropTypes.func.isRequired,
  onCancelReply: PropTypes.func.isRequired,
  onAddReply: PropTypes.func.isRequired,
  onEditClick: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
  editingCommentId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  editingCommentText: PropTypes.string,
  maxDepth: PropTypes.number,
  onLoadMoreReplies: PropTypes.func,
  onBackReplies: PropTypes.func,
  replyHasMore: PropTypes.object,
  replyPage: PropTypes.object,
  onReactionChange: PropTypes.func.isRequired,
  currentUser: PropTypes.object,
};

export default CommentItem;
