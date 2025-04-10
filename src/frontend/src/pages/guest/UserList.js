'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { followUser, isFollowing, unfollowUser } from 'services/follow.service';
import { searchUsers } from 'services/user.list.service';
import Box from '@mui/material/Box';
import DataTable from 'components/molecules/DataTable';
import AddEditModal from 'components/molecules/users/AddEditModal';
import { criteria, meta as defaultMeta } from 'config/search';

function Users() {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  // Replace this with your actual user data from auth context or similar
  const [user, setUser] = useState({ role: 'user', id: 1 }); // Example user
  const [query, setQuery] = useState(criteria);
  const [meta, setMeta] = useState(defaultMeta);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await searchUsers(query);
      setMeta({ ...response.meta });
      setData(response.data);
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

  const headers = [
    {
      id: 'id',
      numeric: false,
      disablePadding: false,
      label: 'Profile',
    },
    {
      id: 'first_name',
      numeric: false,
      disablePadding: false,
      label: t('pages.users.first_name'),
    },
    {
      id: 'last_name',
      numeric: false,
      disablePadding: false,
      label: t('pages.users.last_name'),
    },
    {
      id: 'status.name',
      numeric: false,
      disablePadding: false,
      label: t('pages.users.status'),
    },
  ];

  const handleChangePage = (event, value) => {
    setQuery({ ...query, ...{ page: value } });
  };

  const handleSort = (event, { order, sort }) => {
    setQuery({ ...query, ...{ order, sort } });
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
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <DataTable
          header={headers}
          data={data}
          page={query.page}
          total={meta.lastPage}
          order={query.order}
          sort={query.sort}
          handleChangePage={handleChangePage}
          handleSort={handleSort}
          handleSearch={handleSearch}
          handleEdit={false}
          handleDelete={false}
          handleFollow={handleFollow}
          showAddNew={false}
          handleAdd={user?.role === 'user' ? () => setOpen(true) : false}
          toolbar={true}
          alignSearchRight={true}
          user={user}
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
