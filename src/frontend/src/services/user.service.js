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
};
