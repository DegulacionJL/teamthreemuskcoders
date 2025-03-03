import api from 'utils/api';

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