import api from 'utils/api';

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

export { searchUsers, createUser, retrieveUser, updateUser, deleteUser };
