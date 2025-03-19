import api from 'utils/api';

// Service for Posts

const createMemePost = async function (formData) {
  const req = api.post('/posts', formData).then(({ data }) => data);
  return await req;
};

const getMemePosts = async function () {
  const req = api.get('/posts').then(({ data }) => data);
  return await req;
};

const updatePost = async function (post, updatedData) {
  const req = api.put(`/posts/${post}`, updatedData).then(({ data }) => data);

  return await req;
};

const updateImage = async function (post, updatedData) {
  const req = api.post(`/posts/${post}/image`, updatedData).then(({ data }) => {
    console.log('Updated Image Response:', data);
    return data;
  });

  return await req;
};
const deletePost = async function (post) {
  const req = api.delete(`/posts/${post}`).then(({ data }) => data);
  return await req;
};

// Service for comments
const getComments = async function (postId) {
  const req = api.get(`/posts/${postId}/comments`).then(({ data }) => data);
  return await req;
};

const addComment = async function (postId, commentText) {
  const req = api
    .post(`/posts/${postId}/comments`, {
      post_id: postId,
      text: commentText,
    })
    .then(({ data }) => data);
  return await req;
};

const deleteComment = async function (postId, commentId) {
  const req = api.delete(`/posts/${postId}/comments/${commentId}`).then(({ data }) => data);
  return await req;
};

const updateComment = async function (postId, commentId, updatedText) {
  try {
    const response = await api.put(`/posts/${postId}/comments/${commentId}`, {
      post_id: postId,
      text: updatedText,
    });

    // Return the response directly
    return response;
  } catch (error) {
    console.error('Error in updateComment service:', error);
    throw error;
  }
};

export { createMemePost, getMemePosts, updatePost, deletePost, updateImage };
