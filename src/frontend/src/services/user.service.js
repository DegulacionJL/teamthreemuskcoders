import api from 'utils/api';

// Existing functions
const searchUsers = async (query) => {
  const req = api.get(`/users?${new URLSearchParams(query).toString()}`).then(({ data }) => data);
  const { meta, data } = await req;
  return { meta, data };
};

const createUser = async (data) => {
  const req = api.post('/users', data).then(({ data }) => data.data);
  return await req;
};

const retrieveUser = async (id) => {
  const req = api.get(`/users/${id}`).then(({ data }) => data.data);
  return await req;
};

const updateUser = async (id, data) => {
  const req = api.put(`/users/${id}`, data).then(({ data }) => data.data);
  return await req;
};

const deleteUser = async (id) => {
  const req = api.delete(`/users/${id}`).then(({ data }) => data);
  const { deleted } = await req;
  return deleted;
};

// New timeline-related functions
const getUserProfile = async (userId) => {
  try {
    // Use only the new timeline endpoint
    const response = await api.get(`/timeline/users/${userId}/profile`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);

    // Fallback return if API fails
    return {
      id: Number.parseInt(userId),
      firstName: 'User',
      lastName: '',
      avatar: '/placeholder.svg?height=180&width=180&text=User',
      coverPhoto: '/placeholder.svg?height=300&width=1000&text=Cover',
      bio: '',
      work: '',
      education: '',
      location: '',
      birthday: '',
      website: '',
      relationship: '',
      postsCount: 0,
      followersCount: 0,
      followingCount: 0,
    };
  }
};

const getUserPosts = async (userId) => {
  try {
    const req = api.get(`/timeline/users/${userId}/posts`).then(({ data }) => data.data);
    return await req;
  } catch (error) {
    console.error('Error fetching user posts:', error);
    return [];
  }
};

// Get user connections (friends, followers, following)
const getUserConnections = async (userId) => {
  try {
    const req = api.get(`/timeline/users/${userId}/friends`).then(({ data }) => data.data);
    return await req;
  } catch (error) {
    console.error('Error fetching user connections:', error);
    return { followers: [], following: [] };
  }
};

const updateUserProfile = async (userId, profileData) => {
  try {
    const req = api
      .put(`/timeline/users/${userId}/profile`, profileData)
      .then(({ data }) => data.data);
    return await req;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

const uploadUserAvatar = async (userId, file) => {
  try {
    const formData = new FormData();
    formData.append('avatar', file);

    const req = api
      .post(`/timeline/users/${userId}/avatar`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(({ data }) => data.data);

    return await req;
  } catch (error) {
    console.error('Error uploading avatar:', error);
    throw error;
  }
};

const uploadCoverPhoto = async (userId, file) => {
  try {
    const formData = new FormData();
    formData.append('coverPhoto', file);

    const req = api
      .post(`/timeline/users/${userId}/cover-photo`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(({ data }) => data.data);

    return await req;
  } catch (error) {
    console.error('Error uploading cover photo:', error);
    throw error;
  }
};

// console.log('Token:', localStorage.getItem('access_token'));

const getSuggestedUsers = async ($id) => {
  const response = await api.get(`/users/suggested/${$id}`);
  // console.log('suggestedUsers', response.data);
  // const suggestedUsers = response.data.map((follow) => follow.user);
  // console.log('suggestedUsers', suggestedUsers);
  return response.data.data;
  // try {
  //   const authToken = localStorage.getItem('access_token'); // Retrieve token from local storage
  //   if (!authToken) {
  //     console.error('Authentication token is missing');
  //     throw new Error('Authentication token is missing');
  //   }

  //   console.log('Making API request with token:', authToken.substring(0, 10) + '...');

  //   const response = await api.get('/users/suggested', {
  //     headers: {
  //       Authorization: `Bearer ${authToken}`, // Pass token in the Authorization header
  //     },
  //   });

  //   console.log('API response status:', response.status);
  //   return response.data.data;
  // } catch (error) {
  //   console.error('Error fetching suggested users:', error);
  //   if (error.response) {
  //     console.error('Response data:', error.response.data);
  //     console.error('Response status:', error.response.status);
  //   }
  //   throw error;
  // }
};
const getTrendingMemes = async () => {
  try {
    const authToken = localStorage.getItem('access_token'); // Retrieve token from local storage
    if (!authToken) throw new Error('Authentication token is missing');

    const response = await api.get('/posts/trending-memes', {
      headers: {
        Authorization: `Bearer ${authToken}`, // Pass token in the Authorization header
      },
    });

    return response.data.data;
  } catch (error) {
    console.error('Error fetching trending hashtags:', error);
    throw error;
  }
};

export {
  searchUsers,
  createUser,
  retrieveUser,
  updateUser,
  deleteUser,
  getUserProfile,
  getUserPosts,
  getUserConnections,
  updateUserProfile,
  uploadUserAvatar,
  uploadCoverPhoto,
  getSuggestedUsers,
  getTrendingMemes,
};
