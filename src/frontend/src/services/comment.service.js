// Front-end Service
import api from 'utils/api';

const getComments = async function (postId) {
  const req = api.get(`/posts/${postId}/comments`).then(({ data }) => data);
  return await req;
};

const addComment = async function (postId, commentText, imageBase64 = null) {
  const req = api
    .post(`/posts/${postId}/comments`, {
      post_id: postId,
      text: commentText,
      image: imageBase64, // Add the base64 image string
    })
    .then(({ data }) => data);
  return await req;
};

const deleteComment = async function (postId, commentId) {
  const req = api.delete(`/posts/${postId}/comments/${commentId}`).then(({ data }) => data);
  return await req;
};

const updateComment = async function (postId, commentId, updatedText, imageBase64 = null) {
  try {
    const requestData = {
      post_id: postId,
      text: updatedText,
    };

    // Only add image to request if provided
    if (imageBase64 !== null) {
      requestData.image = imageBase64;
    }

    const response = await api.put(`/posts/${postId}/comments/${commentId}`, requestData);

    // Return the response directly
    return response;
  } catch (error) {
    console.error('Error in updateComment service:', error);
    throw error;
  }
};

export { getComments, addComment, deleteComment, updateComment };
