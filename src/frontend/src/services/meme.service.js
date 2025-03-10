import api from 'utils/api';

const createMemePost = async function (formData) {
  const req = api.post('/posts', formData).then(({ data }) => data);
  return await req;
};

const getMemePosts = async function () {
  const req = api.get('/posts').then(({ data }) => data);
  return await req;
};

const updatePost = async function (postId, updatedData) {
  const req = api
    .put(`/posts/${postId}`, updatedData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then(({ data }) => data);

  return await req;
};

const deletePost = async function (postId) {
  const req = api.delete(`/posts/${postId}`).then(({ data }) => data);
  return await req;
};

export { createMemePost, getMemePosts, updatePost, deletePost };
