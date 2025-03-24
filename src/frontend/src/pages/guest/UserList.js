import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { searchUsers } from 'services/user.list.service';
import { followUser, retrieveUser } from 'services/user.service';
import Box from '@mui/material/Box';
import DataTable from 'components/molecules/DataTable';
import AddEditModal from 'components/molecules/users/AddEditModal';
import { criteria, meta as defaultMeta } from 'config/search';

function Users() {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [user, setUser] = useState(null);
  const [query, setQuery] = useState(criteria);
  const [meta, setMeta] = useState(defaultMeta);
  const [open, setOpen] = useState(false);

  const fetchUsers = async () => {
    const { meta, data } = await searchUsers(query);
    setMeta({ ...meta, meta });
    setData(data);
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

  const handleEdit = async (id) => {
    const user = await retrieveUser(id);
    setOpen(true);
    setUser(user);
  };

  const handleFollow = async (id) => {
    try {
      await followUser(id);
      toast(t('pages.users.user_followed'), { type: 'success' });
      fetchUsers(); // Refresh user list
    } catch (error) {
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

    let updatedList = [...data];
    const index = updatedList.findIndex((row) => parseInt(row.id) === parseInt(response.id));
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
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          showAddNew={false}
          handleAdd={false}
          toolbar={true}
          alignSearchRight={true}
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
