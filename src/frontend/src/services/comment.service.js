import api from 'utils/api';

const getComments = async (postId, params = {}) => {
  const req = api.get(`/posts/${postId}/comments`, { params }).then(({ data }) => ({
    data: data.data,
    pagination: data.pagination,
  }));
  return await req;
};

const addComment = async (postId, commentText, commentImage, parentId = null) => {
  const isMultipart = !!commentImage;
  const requestData = isMultipart
    ? (() => {
        const formData = new FormData();
        formData.append('post_id', postId);
        formData.append('text', commentText || '');
        formData.append('image', commentImage);
        if (parentId) formData.append('parent_id', parentId);
        return formData;
      })()
    : { post_id: postId, text: commentText, parent_id: parentId || null };

  const config = isMultipart ? api.createRequestConfig(requestData) : {};
  if (!commentText && !commentImage) throw new Error('Comment must have either text or an image');

  const req = api.post(`/posts/${postId}/comments`, requestData, config).then(({ data }) => data);
  return await req;
};

const deleteComment = async (postId, commentId) => {
  const req = api.delete(`/posts/${postId}/comments/${commentId}`).then(({ data }) => data);
  return await req;
};

const updateComment = async (postId, commentId, data) => {
  data.append('_method', 'PUT');
  const req = api
    .post(`/posts/${postId}/comments/${commentId}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then(({ data }) => data);
  return await req;
};

const likeComment = async (commentId) => {
  const req = api
    .post(`/likes/comments/${commentId}`)
    .then(({ data }) => {
      console.log('Like Comment Response:', data);
      return data;
    })
    .catch((error) => {
      console.error('Error liking comment:', error);
      throw error;
    });
  return await req;
};

const unlikeComment = async (commentId) => {
  const req = api
    .post(`/likes/comments/${commentId}/unlike`)
    .then(({ data }) => {
      console.log('Unlike Comment Response:', data);
      return data;
    })
    .catch((error) => {
      console.error('Error unliking comment:', error);
      throw error;
    });
  return await req;
};

const getCommentLikes = async (commentId) => {
  const req = api
    .get(`/likes/comments/${commentId}/likes`)
    .then(({ data }) => {
      if (data.user_has_liked === undefined && data.user_reaction) {
        data.user_has_liked = true;
      }
      return data;
    })
    .catch((error) => {
      console.error('Error in getCommentLikes service:', error);
      return {
        likes: [],
        like_count: 0,
        user_has_liked: false,
        user_reaction: null,
      };
    });
  return await req;
};

export {
  getComments,
  addComment,
  deleteComment,
  updateComment,
  likeComment,
  unlikeComment,
  getCommentLikes,
};
