import api from 'utils/api';

const createMemePost = async function (formData) {
  const req = api.post('/posts', formData).then(({ data }) => data);
  return await req;
};

const getMemePosts = async function () {
  const req = api.get('/posts').then(({ data }) => data);
  return await req;
};

export { createMemePost, getMemePosts };
