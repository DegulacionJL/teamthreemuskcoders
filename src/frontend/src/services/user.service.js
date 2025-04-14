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
  let userData; // Declare outside so it's accessible in catch

  try {
    // Use the existing retrieveUser function to get basic user data
    userData = await retrieveUser(userId);

    // Get additional profile data if needed
    const req = api.get(`/timeline/users/${userId}/profile`).then(({ data }) => data.data);
    const profileData = await req;

    // Combine user data with profile data
    return {
      ...userData,
      ...profileData,
      postsCount: profileData?.postsCount || 0,
      followersCount: profileData?.followersCount || 0,
      followingCount: profileData?.followingCount || 0,
    };
  } catch (error) {
    console.error('Error fetching user profile:', error);

    // Fallback return if API fails or doesn't exist yet
    return {
      id: parseInt(userId),
      firstName: userData?.first_name || 'User',
      lastName: userData?.last_name || '',
      avatar: userData?.avatar || '/placeholder.svg?height=180&width=180&text=User',
      coverPhoto: '/placeholder.svg?height=300&width=1000&text=Cover',
      bio: userData?.bio || '',
      work: userData?.work || '',
      education: userData?.education || '',
      location: userData?.location || '',
      birthday: userData?.birthday || '',
      website: userData?.website || '',
      relationship: userData?.relationship || '',
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
  updateUserProfile,
  uploadUserAvatar,
  uploadCoverPhoto,
};
