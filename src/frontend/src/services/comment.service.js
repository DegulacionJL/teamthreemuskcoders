// comment.service.js
import api from 'utils/api';

const getComments = async function (postId, params = {}) {
  const req = api.get(`/posts/${postId}/comments`, { params }).then(({ data }) => ({
    data: data.data,
    pagination: data.pagination,
  }));
  return await req;
};

const addComment = async function (postId, commentText, commentImage, parentId = null) {
  let requestData;
  let config = {};

  if (!commentText && !commentImage) {
    throw new Error('Comment must have either text or an image');
  }

  if (commentImage) {
    requestData = new FormData();
    requestData.append('post_id', postId);
    requestData.append('text', commentText || '');
    requestData.append('image', commentImage);
    if (parentId) {
      requestData.append('parent_id', parentId);
    }
    config = api.createRequestConfig(requestData);
  } else {
    requestData = {
      post_id: postId,
      text: commentText,
      parent_id: parentId || null,
    };
  }

  const req = api.post(`/posts/${postId}/comments`, requestData, config).then(({ data }) => data);
  return await req;
};

const deleteComment = async function (postId, commentId) {
  const req = api.delete(`/posts/${postId}/comments/${commentId}`).then(({ data }) => data);
  return await req;
};

const updateComment = async function (postId, commentId, data) {
  console.log('Update Service Data: ', Object.fromEntries(data.entries()));

  try {
    data.append('_method', 'PUT');

    const response = await api.post(`/posts/${postId}/comments/${commentId}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error in updateComment service:', error);
    throw error;
  }
};

const likeComment = async function (commentId) {
  const req = api
    .post(`/likes/comments/${commentId}`) // Adjust endpoint as per your backend
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

const unlikeComment = async function (commentId) {
  const req = api
    .post(`/likes/comments/${commentId}/unlike`) // Adjust endpoint
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
  try {
    const response = await api.get(`/likes/comments/${commentId}/likes`); // Adjust endpoint

    // Ensure response has expected structure
    if (response.data) {
      if (response.data.user_has_liked === undefined && response.data.user_reaction) {
        response.data.user_has_liked = true;
      }
    }

    return response.data;
  } catch (error) {
    console.error('Error in getCommentLikes service:', error);
    return {
      likes: [],
      like_count: 0,
      user_has_liked: false,
      user_reaction: null,
    };
  }
};

export {
  likeComment,
  unlikeComment,
  getCommentLikes,
  getComments,
  addComment,
  deleteComment,
  updateComment,
};
