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

// Service for Comments
const createComment = async function (postId, content) {
  const req = api.post('/comments', formData).then(({ data }) => data);
  return await req;
};

export { createMemePost, getMemePosts, updatePost, deletePost, updateImage };
