import axios from 'axios';

const API_URL = 'http://localhost:8000/api/admin'; // Adjust as needed

export const getUsers = async () => {
  const response = await axios.get(`${API_URL}/users`);
  return response.data;
};

export const deleteUser = async (id) => {
  await axios.delete(`${API_URL}/users/${id}`);
};

export const getMemes = async () => {
  const response = await axios.get(`${API_URL}/memes`);
  return response.data;
};

export const deleteMeme = async (id) => {
  await axios.delete(`${API_URL}/memes/${id}`);
};

export const getReportedMemes = async () => {
  const response = await axios.get(`${API_URL}/memes/reported`);
  return response.data;
};

export const getDashboardStats = async () => {
  const response = await axios.get(`${API_URL}/dashboard`);
  return response.data;
};
