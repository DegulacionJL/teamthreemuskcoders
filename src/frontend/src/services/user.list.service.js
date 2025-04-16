import api from 'utils/api';

const searchUsers = async (query) => {
  const req = api
    .get(`/userlist?${new URLSearchParams(query).toString()}`)
    .then(({ data }) => data);
  const { meta, data } = await req;
  return { meta, data };
};

export { searchUsers };
