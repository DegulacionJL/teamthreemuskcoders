import api from 'utils/api';

const createMemePost = async function (postData) {
  const req = api.post('/posts', postData).then(({ data }) => data);
  return await req;
};

export default createMemePost;
