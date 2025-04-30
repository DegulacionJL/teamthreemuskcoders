import api from 'utils/api';

const getAccessToken = () => localStorage.getItem('access_token');

const searchAll = async (query) => {
  try {
    const response = await api.get(`/search?q=${encodeURIComponent(query)}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getAccessToken()}`,
      },
    });
    return response.data; // returns { users, posts, hashtags }
  } catch (error) {
    console.error('Search API error:', error);
    throw error;
  }
};

export { searchAll };
