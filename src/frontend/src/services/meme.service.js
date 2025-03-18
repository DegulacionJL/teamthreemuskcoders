import api from 'utils/api';

// Service for Posts
const createMemePost = async function (formData) {
  const response = await api.post('/posts', formData);
  return response.data;
};

const getMemePosts = async function () {
  const response = await api.get('/posts');
  return response.data;
};

const updatePost = async function (post, updatedData) {
  const response = await api.put(`/posts/${post}`, updatedData);
  return response.data;
};

const updateImage = async function (post, updatedData) {
  const response = await api.post(`/posts/${post}/image`, updatedData);
  return response.data;
};

const deletePost = async function (post) {
  const response = await api.delete(`/posts/${post}`);
  return response.data;
};

// Service for comments
const getComments = async function (postId) {
  const response = await api.get(`/posts/${postId}/comments`);
  return response.data;
};

const addComment = async function (postId, commentText, imageFile = null) {
  const formData = new FormData();
  formData.append('post_id', postId);
  formData.append('text', commentText);

  if (imageFile) {
    formData.append('image_url', imageFile);
  }

  const response = await api.post(`/posts/${postId}/comments`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

const addReplyComment = async function (postId, parentCommentId, commentText, imageFile = null) {
  const formData = new FormData();
  formData.append('post_id', postId);
  formData.append('text', commentText);
  formData.append('parent_id', parentCommentId);

  if (imageFile) {
    formData.append('image_url', imageFile);
  }

  const response = await api.post(`/posts/${postId}/comments`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

const deleteComment = async function (postId, commentId) {
  const response = await api.delete(`/posts/${postId}/comments/${commentId}`);
  return response.data;
};

const updateComment = async (postId, commentId, updatedText, imageFile = null) => {
  const formData = new FormData();
  formData.append('post_id', postId);
  formData.append('text', updatedText || ''); // Fixed the order issue

  console.log('Text value being sent:', updatedText);

  if (imageFile) {
    console.log('Image file being sent:', imageFile);
    formData.append('image_url', imageFile);
  }

  try {
    const response = await api.put(`/posts/${postId}/comments/${commentId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to update comment:', error.response?.data || error);
    throw new Error('Unable to update comment. Please try again later.');
  }
};

export {
  createMemePost,
  getMemePosts,
  updatePost,
  deletePost,
  updateImage,
  getComments,
  addComment,
  addReplyComment,
  deleteComment,
  updateComment,
};
