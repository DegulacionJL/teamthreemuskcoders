import api from 'utils/api';

const createMemePost = async function (postData) {
  const req = api.post('/posts', postData).then(({ data }) => data);
  return await req;
};

const getMemePosts = async function () {
  const req = api.get('/posts', post).then(({ data }) => data);
  return await req;
};

export default createMemePost;
