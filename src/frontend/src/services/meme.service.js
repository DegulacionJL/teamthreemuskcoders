import api from 'utils/api';

// Service for Posts

const createMemePost = async function (formData) {
  const req = api.post('/posts', formData).then(({ data }) => data);
  return await req;
};

const getMemePosts = async (page = 1) => {
  try {
    // Add a timestamp to prevent caching
    const timestamp = new Date().getTime();

    // Make the API request
    console.log(`Making request to: /api/v1/posts?page=${page}&_=${timestamp}`);

    const response = await api.get(`/posts?page=${page}&_=${timestamp}`, {
      headers: {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        Accept: 'application/json',
      },
    });

    console.log(`API Response status:`, response);

    const data = response.data;
    console.log('API Response data:', data);

    return data;
  } catch (error) {
    console.error('Error fetching memeposts: ', error);
    throw error;
  }
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

const likePost = async function (postId) {
  const req = api
    .post(`/likes/${postId}`)
    .then(({ data }) => {
      console.log('Like Response:', data);
      return data;
    })
    .catch((error) => {
      console.error('Error liking post:', error);
      throw error;
    });

  return await req;
};

const unlikePost = async function (postId) {
  const req = api
    .post(`/likes/${postId}/unlike`)
    .then(({ data }) => {
      console.log('Unlike Response:', data);
      return data;
    })
    .catch((error) => {
      console.error('Error unliking post:', error);
      throw error;
    });

  return await req;
};

const getLikes = async function (postId) {
  const response = await api.get(`/likes/${postId}/likes`);
  return response.data;
};

export {
  createMemePost,
  getMemePosts,
  updatePost,
  deletePost,
  updateImage,
  likePost,
  unlikePost,
  getLikes,
};
