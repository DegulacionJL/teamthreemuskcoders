import api from 'utils/api';

// Use a function to get the token to ensure it's always fresh
const getAccessToken = () => localStorage.getItem('access_token');

const followUser = async (userId) => {
  try {
    const response = await api.post(
      `/follow/${userId}`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAccessToken()}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Follow API error:', error);
    throw error;
  }
};

const unfollowUser = async (userId) => {
  try {
    const response = await api.post(
      `/follow/${userId}/unfollow`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAccessToken()}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Unfollow API error:', error);
    throw error;
  }
};

const isFollowing = async (userId) => {
  try {
    const response = await api.get(`/is-following/${userId}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getAccessToken()}`,
      },
    });
    return response.data.isFollowing;
  } catch (error) {
    console.error('isFollowing API error:', error);
    throw error;
  }
};

export { followUser, unfollowUser, isFollowing };
