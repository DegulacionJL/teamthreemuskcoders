import PropTypes from 'prop-types';
import { useState } from 'react';
import {
  ChatBubbleOutline as CommentIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Favorite as FavoriteIcon,
  MoreVert as MoreVertIcon,
  Send as SendIcon,
  Share as ShareIcon,
} from '@mui/icons-material';
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
  TextField,
  Typography,
} from '@mui/material';
import { formatTimeAgo } from '../../../utils/date-utils';

const PostCard = ({ post }) => {
  const [liked, setLiked] = useState(post.liked || false);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState(post.comments || []);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleLike = () => {
    if (liked) {
      setLikesCount(likesCount - 1);
    } else {
      setLikesCount(likesCount + 1);
    }
    setLiked(!liked);
    // Call API to update like status
  };

  const handleComment = () => {
    setShowComments(!showComments);
  };

  const handleSubmitComment = () => {
    if (commentText.trim()) {
      const newComment = {
        id: Date.now(),
        user: {
          id: 1, // Current user ID
          name: 'Current User', // Current user name
          avatar: '/placeholder.svg?height=40&width=40&text=Me', // Current user avatar
        },
        text: commentText,
        createdAt: new Date().toISOString(),
      };

      setComments([...comments, newComment]);
      setCommentText('');
      // Call API to save comment
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
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
          <Typography variant="body2" color="text.secondary">
            {post.createdAt ? formatTimeAgo(post.createdAt) : 'Unknown time'}
          </Typography>
        }
      />

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleMenuClose}>Save Post</MenuItem>
        <MenuItem onClick={handleMenuClose}>Report Post</MenuItem>
        {post.isOwnPost && <MenuItem onClick={handleMenuClose}>Delete Post</MenuItem>}
      </Menu>

      <CardContent sx={{ pt: 0 }}>
        <Typography variant="body1" sx={{ mb: post.image ? 2 : 0 }}>
          {post.content}
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
          {likesCount > 0 && (
            <>
              <FavoriteIcon
                fontSize="small"
                color="error"
                sx={{ fontSize: 16, verticalAlign: 'text-bottom', mr: 0.5 }}
              />
              {likesCount} {likesCount === 1 ? 'like' : 'likes'}
            </>
          )}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {comments.length > 0 && (
            <>
              {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
            </>
          )}
        </Typography>
      </Box>

      <Divider />

      <CardActions sx={{ justifyContent: 'space-around', px: 2 }}>
        <Button
          startIcon={liked ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
          onClick={handleLike}
          sx={{
            color: liked ? 'error.main' : 'text.secondary',
            textTransform: 'none',
          }}
        >
          Like
        </Button>
        <Button
          startIcon={<CommentIcon />}
          onClick={handleComment}
          sx={{ color: 'text.secondary', textTransform: 'none' }}
        >
          Comment
        </Button>
        <Button startIcon={<ShareIcon />} sx={{ color: 'text.secondary', textTransform: 'none' }}>
          Share
        </Button>
      </CardActions>

      {/* Comments Section */}
      {(showComments || comments.length > 0) && (
        <Box sx={{ p: 2, pt: 0 }}>
          <Divider sx={{ my: 1 }} />

          {/* Comment Input */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
            <Avatar
              src="/placeholder.svg?height=32&width=32&text=Me"
              sx={{ width: 32, height: 32, mr: 1.5 }}
            />
            <TextField
              fullWidth
              size="small"
              placeholder="Write a comment..."
              variant="outlined"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              InputProps={{
                endAdornment: (
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={handleSubmitComment}
                    disabled={!commentText.trim()}
                  >
                    <SendIcon fontSize="small" />
                  </IconButton>
                ),
                sx: { borderRadius: 10 },
              }}
            />
          </Box>

          {/* Comments List */}
          {comments.map((comment) => (
            <Box key={comment.id} sx={{ display: 'flex', mb: 2 }}>
              <Avatar src={comment.user.avatar} sx={{ width: 32, height: 32, mr: 1.5 }} />
              <Box sx={{ flex: 1 }}>
                <Box
                  sx={{
                    backgroundColor: 'grey.100',
                    p: 1.5,
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 'medium' }}>
                    {comment.user.name}
                  </Typography>
                  <Typography variant="body2">{comment.text}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mt: 0.5, ml: 1 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ mr: 1.5 }}>
                    {formatTimeAgo(comment.createdAt)}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontWeight: 'medium', cursor: 'pointer', mr: 1.5 }}
                  >
                    Like
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontWeight: 'medium', cursor: 'pointer' }}
                  >
                    Reply
                  </Typography>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Card>
  );
};

PostCard.propTypes = {
  post: PropTypes.shape({
    liked: PropTypes.bool,
    likesCount: PropTypes.number,
    comments: PropTypes.array,
    user: PropTypes.shape({
      avatar: PropTypes.string,
      name: PropTypes.string,
    }),
    createdAt: PropTypes.string,
    isOwnPost: PropTypes.bool,
    image: PropTypes.string,
    content: PropTypes.string,
  }).isRequired,
};

export default PostCard;
