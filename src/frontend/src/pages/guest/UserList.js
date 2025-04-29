import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { followUser, isFollowing, unfollowUser } from 'services/follow.service';
import { searchUsers } from 'services/user.list.service';
import Box from '@mui/material/Box';
import UsersCardList from 'components/molecules/UsersCardList';
import AddEditModal from 'components/molecules/users/AddEditModal';
import { criteria, meta as defaultMeta } from 'config/search';

function Users() {
  const { t } = useTranslation();

  const [data, setData] = useState([]);
  const [user] = useState({ role: 'user', id: 1 });
  const [query, setQuery] = useState({
    ...criteria,
    limit: 20, // Set page size to 20 users
  });
  const [meta, setMeta] = useState(defaultMeta);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Ensure we're requesting 20 users per page
      const queryWithLimit = { ...query, limit: 20 };
      const response = await searchUsers(queryWithLimit);

      // Process the data to include isFollowing status
      const processedData = await Promise.all(
        response.data.map(async (user) => {
          const following = await isFollowing(user.id);
          return { ...user, isFollowing: following };
        })
      );

      setMeta({ ...response.meta });
      setData(processedData);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast(t('pages.users.fetch_failed'), { type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [query]);

  const handleChangePage = (event, value) => {
    setQuery({ ...query, ...{ page: value } });
  };

  const handleSearch = (keyword) => {
    setQuery({ ...query, ...{ keyword, page: 1 } });
  };

  const handleFollow = async (id) => {
    console.log('Follow button clicked for ID:', id);
    try {
      // Check if already following
      const isAlreadyFollowing = await isFollowing(id);

      if (isAlreadyFollowing) {
        // If already following, unfollow
        await unfollowUser(id);
        toast(t('pages.users.user_unfollowed'), { type: 'success' });
      } else {
        // If not following, follow
        await followUser(id);
        toast(t('pages.users.user_followed'), { type: 'success' });
      }

      // Refresh user list to update UI
      fetchUsers();
    } catch (error) {
      console.error('Follow/unfollow request failed:', error);
      toast(t('pages.users.follow_failed'), { type: 'error' });
    }
  };

  const handleSaveEvent = (response) => {
    if (!user) {
      fetchUsers();
      setOpen(false);
      toast(t('pages.users.user_created'), { type: 'success' });
      return;
    }

    const updatedList = [...data];
    const index = updatedList.findIndex(
      (row) => Number.parseInt(row.id) === Number.parseInt(response.id)
    );
    updatedList[index] = response;
    setData(updatedList);
    setOpen(false);
    toast(t('pages.users.user_updated'), { type: 'success' });
  };

  return (
    <Box>
      <Box>
        <UsersCardList
          data={data}
          page={query.page}
          total={meta.lastPage}
          handleChangePage={handleChangePage}
          handleSearch={handleSearch}
          handleFollow={handleFollow}
          user={user}
          loading={loading}
        />
      </Box>
      <AddEditModal
        open={open}
        user={user}
        handleSaveEvent={handleSaveEvent}
        handleClose={() => setOpen(false)}
      />
    </Box>
  );
}

export default Users;
