// comment.service.js
import api from 'utils/api';

// Helper method to handle image upload
const createRequestConfig = (data) => {
  return {
    headers:
      data instanceof FormData
        ? { 'Content-Type': undefined }
        : { 'Content-Type': 'application/json' },
  };
};

const getComments = async function (postId) {
  const req = api.get(`/posts/${postId}/comments`).then(({ data }) => data);
  return await req;
};

const addComment = async function (postId, commentText, commentImage = null) {
  // Create appropriate data structure based on presence of image
  let requestData;
  let config = {};

  if (commentImage) {
    requestData = new FormData();
    requestData.append('post_id', postId);
    requestData.append('text', commentText);
    requestData.append('image', commentImage);
    config = createRequestConfig(requestData);
  } else {
    requestData = {
      post_id: postId,
      text: commentText,
    };
  }

  const req = api.post(`/posts/${postId}/comments`, requestData, config).then(({ data }) => data);
  return await req;
};

const deleteComment = async function (postId, commentId) {
  const req = api.delete(`/posts/${postId}/comments/${commentId}`).then(({ data }) => data);
  return await req;
};

const updateComment = async function (postId, commentId, updatedText, commentImage = null) {
  try {
    // Create appropriate data structure based on presence of image
    let requestData;
    let config = {};

    if (commentImage) {
      requestData = new FormData();
      requestData.append('post_id', postId);
      requestData.append('text', updatedText);
      requestData.append('image', commentImage);
      config = createRequestConfig(requestData);
    } else {
      requestData = {
        post_id: postId,
        text: updatedText,
      };
    }

    const response = await api.put(`/posts/${postId}/comments/${commentId}`, requestData, config);
    return response;
  } catch (error) {
    console.error('Error in updateComment service:', error);
    throw error;
  }
};

export { getComments, addComment, deleteComment, updateComment };
