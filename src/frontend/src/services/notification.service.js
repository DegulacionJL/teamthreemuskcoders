import api from 'utils/api';

const searchNotifications = async (query = {}) => {
  const req = api
    .get(`/notifications?${new URLSearchParams(query).toString()}`)
    .then(({ data }) => data);
  const { meta, data, unread } = await req;
  return { meta, data, unread };
};

const markNotificationSeen = async (id) => {
  const req = api.put(`/notifications/${id}/seen`).then(({ data }) => data);
  return await req;
};

const clearNotifications = async () => {
  // Use your api instance for consistency and auth
  return api.delete('/notifications/clear-all');
};

export { searchNotifications, markNotificationSeen, clearNotifications };
