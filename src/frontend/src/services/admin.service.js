import api from 'utils/api';

const getUsers = async () => {
  const req = api.get('/admin/users').then(({ data }) => data);
  return await req;
};

const deleteUser = async (id) => {
  const req = api.delete(`/admin/users/${id}`).then(({ data }) => data);
  return await req;
};

const getMemes = async () => {
  const req = api.get('/admin/memes').then(({ data }) => data);
  return await req;
};

const deleteMeme = async (id) => {
  const req = api.delete(`/admin/memes/${id}`).then(({ data }) => data);
  return await req;
};

const getReportedMemes = async () => {
  const req = await api.get('/admin/memes/reported').then(({ data }) => data);
  console.log('admin service: ', req);
  return req;
};

const getDashboardStats = async () => {
  try {
    console.log('📡 Fetching dashboard stats...');
    const { data } = await api.get('/admin/dashboard');
    console.log('✅ Dashboard stats received:', data);
    return data;
  } catch (error) {
    console.error('❌ Error fetching dashboard stats:', error);
    throw error;
  }
};

export { getUsers, deleteUser, getMemes, deleteMeme, getReportedMemes, getDashboardStats };
