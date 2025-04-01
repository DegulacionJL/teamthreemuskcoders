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

export { getComments, addComment, deleteComment, updateComment };
