import { useCallback, useEffect, useRef, useState } from 'react';
import {
  addComment,
  deleteComment,
  getComments,
  getReplies,
  getTotalCommentsCount,
  likeComment,
  unlikeComment,
  updateComment, // Add the missing import
} from 'services/comment.service';

export const useComments = (postId) => {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCommentsCount, setTotalCommentsCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState('');
  const [tempEditingText, setTempEditingText] = useState('');
  const [commentImage, setCommentImage] = useState(null);
  const [updateCommentImagePreview, setUpdateCommentImagePreview] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [replyToComment, setReplyToComment] = useState(null);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [replyPages, setReplyPages] = useState({});
  const [replyLoading, setReplyLoading] = useState({});
  const isFetchingComments = useRef(false);
  const hasFetchedComments = useRef(false);

  // Fetch only the total comment count (used on initial load)
  const fetchTotalCommentsCount = useCallback(async () => {
    try {
      const response = await getTotalCommentsCount(postId);
      const count = response.total_with_replies || 0;
      setTotalCommentsCount(count);
    } catch (error) {
      console.error('Error fetching total comments count:', error);
      setTotalCommentsCount(0);
    }
  }, [postId]);

  // Fetch full comments data when explicitly requested
  const fetchComments = useCallback(
    async (page = 1, append = false) => {
      if (isFetchingComments.current) return;
      isFetchingComments.current = true;
      setIsLoading(true);
      try {
        const response = await getComments(postId, {
          page,
          per_page: 5,
          sort: 'asc',
        });

        const processedComments = response.data.map((comment) => ({
          ...comment,
          likeCount: comment.like_count,
          reactionType: comment.user_has_liked ? '😂' : null,
          replies: comment.replies.map((reply) => ({
            ...reply,
            likeCount: reply.like_count,
            reactionType: reply.user_has_liked ? '😂' : null,
          })),
          replies_pagination: comment.replies_pagination,
        }));

        if (append) {
          setComments((prev) => [...prev, ...processedComments]);
        } else {
          setComments(processedComments);
        }

        setHasMore(response.pagination.has_more);
        setCurrentPage(page);
        const newCount = response.pagination.total_with_replies || 0;
        setTotalCommentsCount(newCount);
        hasFetchedComments.current = true;
      } catch (error) {
        console.error('Error fetching comments:', error);
        if (!append) {
          setComments([]);
          setHasMore(false);
        }
      } finally {
        setIsLoading(false);
        isFetchingComments.current = false;
      }
    },
    [postId]
  );

  const fetchReplies = useCallback(
    async (commentId, page = 1, append = false) => {
      setReplyLoading((prev) => ({ ...prev, [commentId]: true }));
      try {
        const response = await getReplies(postId, commentId, {
          page,
          per_page: 3,
          sort: 'asc',
        });

        const processedReplies = response.data.map((reply) => ({
          ...reply,
          likeCount: reply.like_count,
          reactionType: reply.user_has_liked ? '😂' : null,
        }));

        setComments((prev) =>
          prev.map((comment) =>
            comment.id === commentId
              ? {
                  ...comment,
                  replies: append
                    ? [...(comment.replies || []), ...processedReplies]
                    : processedReplies,
                  replies_pagination: response.pagination,
                }
              : comment
          )
        );

        setReplyPages((prev) => ({
          ...prev,
          [commentId]: page,
        }));
      } catch (error) {
        console.error('Error fetching replies:', error);
      } finally {
        setReplyLoading((prev) => ({ ...prev, [commentId]: false }));
      }
    },
    [postId]
  );

  // Fetch total comment count on mount
  useEffect(() => {
    fetchTotalCommentsCount();
  }, [fetchTotalCommentsCount]);

  const handleAddComment = useCallback(
    async (text, image) => {
      if (!text.trim() && !image) return;
      setIsLoading(true);
      try {
        await addComment(postId, text, image);
        await fetchComments(1);
        await fetchTotalCommentsCount(); // Update total count after adding a comment
      } catch (error) {
        console.error('Error adding comment:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [postId, fetchComments, fetchTotalCommentsCount]
  );

  const handleAddReply = useCallback(
    async (parentId, text, image) => {
      if (!text.trim() && !image) return;
      setIsLoading(true);
      try {
        const parentComment = comments.find((comment) =>
          comment.replies.some((reply) => reply.id === parentId)
        );
        const finalParentId = parentComment ? parentComment.id : parentId;

        await addComment(postId, text, image, finalParentId);
        setReplyToComment(null);
        await fetchComments(1);
        await fetchTotalCommentsCount(); // Update total count after adding a reply
        setReplyPages((prev) => ({ ...prev, [finalParentId]: 1 }));
      } catch (error) {
        console.error('Error adding reply:', error);
        await fetchComments(1);
        await fetchTotalCommentsCount();
      } finally {
        setIsLoading(false);
      }
    },
    [postId, comments, fetchComments, fetchTotalCommentsCount]
  );

  const confirmDeleteComment = useCallback((commentId) => {
    setCommentToDelete(commentId);
    setIsDeleteModalOpen(true);
  }, []);

  const handleDeleteComment = useCallback(async () => {
    if (!commentToDelete) return;
    setIsLoading(true);
    try {
      await deleteComment(postId, commentToDelete);
      await fetchComments(1);
      await fetchTotalCommentsCount(); // Update total count after deleting a comment
      setReplyPages({});
    } catch (error) {
      console.error('Error deleting comment:', error);
    } finally {
      setCommentToDelete(null);
      setIsDeleteModalOpen(false);
      setIsLoading(false);
    }
  }, [postId, commentToDelete, fetchComments, fetchTotalCommentsCount]);

  const handleEditCommentClick = useCallback((comment) => {
    setEditingCommentId(comment.id);
    setEditingCommentText(comment.text || '');
    setTempEditingText(comment.text || '');
    setUpdateCommentImagePreview(comment.image || null);
    setIsUpdateModalOpen(true);
  }, []);

  const handleUpdateCommentImage = useCallback((e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCommentImage(file);
      setUpdateCommentImagePreview(URL.createObjectURL(file));
    }
  }, []);

  const handleUpdateComment = useCallback(async () => {
    if (!tempEditingText.trim() && !commentImage && updateCommentImagePreview === null) return;
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('text', tempEditingText || '');
      if (commentImage) {
        formData.append('image', commentImage);
      } else if (updateCommentImagePreview === null) {
        formData.append('remove_image', true);
      }
      formData.append('_method', 'PUT');

      await updateComment(postId, editingCommentId, formData); // Now updateComment is defined
      await fetchComments(1);
      await fetchTotalCommentsCount(); // Update total count after updating a comment
      setEditingCommentId(null);
      setEditingCommentText('');
      setTempEditingText('');
      setIsUpdateModalOpen(false);
      setCommentImage(null);
      setUpdateCommentImagePreview(null);
    } catch (error) {
      console.error('Error updating comment:', error);
    } finally {
      setIsLoading(false);
    }
  }, [
    postId,
    editingCommentId,
    tempEditingText,
    commentImage,
    updateCommentImagePreview,
    fetchComments,
    fetchTotalCommentsCount,
  ]);

  const handleCancelUpdateComment = useCallback(() => {
    setEditingCommentId(null);
    setEditingCommentText('');
    setTempEditingText('');
    setIsUpdateModalOpen(false);
    setCommentImage(null);
    setUpdateCommentImagePreview(null);
  }, []);

  const handleLoadMore = useCallback(() => {
    fetchComments(currentPage + 1, true);
  }, [fetchComments, currentPage]);

  const handleLoadMoreReplies = useCallback(
    (commentId) => {
      const nextPage = (replyPages[commentId] || 1) + 1;
      fetchReplies(commentId, nextPage, true);
    },
    [fetchReplies, replyPages]
  );

  const handleLikeComment = useCallback(
    async (commentId) => {
      try {
        await likeComment(commentId);
        await fetchComments(1);
      } catch (error) {
        console.error('Error liking comment:', error);
      }
    },
    [fetchComments]
  );

  const handleUnlikeComment = useCallback(
    async (commentId) => {
      try {
        await unlikeComment(commentId);
        await fetchComments(1);
      } catch (error) {
        console.error('Error unliking comment:', error);
      }
    },
    [fetchComments]
  );

  const handleCommentReactionChange = useCallback(
    (commentId, hasReacted, newReactionType, count) => {
      setComments((prev) =>
        prev.map((comment) =>
          comment.id === commentId
            ? {
                ...comment,
                reactionType: hasReacted ? newReactionType : null,
                likeCount: count,
              }
            : {
                ...comment,
                replies: comment.replies.map((reply) =>
                  reply.id === commentId
                    ? {
                        ...reply,
                        reactionType: hasReacted ? newReactionType : null,
                        likeCount: count,
                      }
                    : reply
                ),
              }
        )
      );
      if (hasReacted && newReactionType) {
        localStorage.setItem(`comment_reaction_${commentId}`, newReactionType);
      } else {
        localStorage.removeItem(`comment_reaction_${commentId}`);
      }
      localStorage.setItem(`comment_like_count_${commentId}`, count.toString());
    },
    []
  );

  return {
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
    hasFetchedComments: hasFetchedComments.current,
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
  };
};
