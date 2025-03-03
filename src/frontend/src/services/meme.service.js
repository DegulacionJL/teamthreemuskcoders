import api from 'utils/api';

<<<<<<< HEAD
const createMemePost = async function (postData) {
  const req = api.post('/posts', postData).then(({ data }) => data);
  return await req;
};

export default createMemePost;
=======
const createMemePost = async (caption, image) => {
  const formData = new FormData();
  formData.append('caption', caption);
  formData.append('image', image);

  const response = await api.post('/memes', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export { createMemePost };
>>>>>>> 0453751b7e208afb25599fb18a420e9b197df56e
