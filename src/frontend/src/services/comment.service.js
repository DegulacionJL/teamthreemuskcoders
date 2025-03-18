import api from 'utils/api';

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

export { getComments, addComment, deleteComment, updateComment };
