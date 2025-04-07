import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { deleteUser, retrieveUser, searchUsers } from 'services/user.service';
import { Email, Person, VerifiedUser, Work } from '@mui/icons-material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
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
      id: 'avatar',
      label: '',
      render: (row) => (
        <Avatar
          src={row?.avatar ? row.avatar.replace(/\\/g, '') : 'https://via.placeholder.com/40'}
          alt="Profile"
          sx={{ width: 40, height: 40 }}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/40';
          }}
        />
      ),
    },
    {
      id: 'first_name',
      label: (
        <>
          <Person sx={{ verticalAlign: 'middle', color: '#512DA8' }} /> {t('First Name')}
        </>
      ),
    },
    {
      id: 'last_name',
      label: (
        <>
          <Person sx={{ verticalAlign: 'middle', color: '#512DA8' }} /> {t('Last Name')}
        </>
      ),
    },
    {
      id: 'email',
      label: (
        <>
          <Email sx={{ verticalAlign: 'middle', color: '#512DA8' }} /> {t('Email Address')}
        </>
      ),
    },
    {
      id: 'role',
      label: (
        <>
          <Work sx={{ verticalAlign: 'middle', color: '#512DA8' }} /> {t('Role')}
        </>
      ),
    },
    {
      id: 'status.name',
      label: (
        <>
          <VerifiedUser sx={{ verticalAlign: 'middle', color: '#512DA8' }} /> {t('Status')}
        </>
      ),
    },
  ];

  return (
    <Box
      sx={{
        p: 3,
        backgroundColor: '#e3f2fd',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Paper
        elevation={4}
        sx={{
          width: '100%',
          maxWidth: 1200,
          p: 3,
          borderRadius: 3,
          backgroundColor: 'white',
          boxShadow: 3,
        }}
      >
        <Typography
          variant="h5"
          sx={{ mb: 3, fontWeight: 'bold', color: '#1c54b2', fontFamily: 'Poppins, sans-serif' }}
        >
          {t('Manage Users')}
        </Typography>

        <DataTable
          header={headers}
          data={data}
          page={query.page}
          total={meta.lastPage}
          order={query.order}
          sort={query.sort}
          handleChangePage={(event, value) => setQuery({ ...query, page: value })}
          handleSort={(event, { order, sort }) => setQuery({ ...query, order, sort })}
          handleSearch={(keyword) => setQuery({ ...query, keyword, page: 1 })}
          handleEdit={async (id) => {
            const user = await retrieveUser(id);
            setOpen(true);
            setUser(user);
          }}
          handleDelete={async (id) => {
            if (confirm(t('Are you sure you want to delete this user?'))) {
              await deleteUser(id);
              fetchUsers();
              toast(t('User deleted successfully'), { type: 'success' });
            }
          }}
          handleAdd={() => {
            setUser(null);
            setOpen(true);
          }}
          sx={{
            boxShadow: 2,
            borderRadius: 2,
            '& .MuiTableHead-root': {
              backgroundColor: '#1e293b',
              color: 'white',
            },
            '& .MuiTableRow-root:hover': {
              backgroundColor: '#bbdefb',
            },
            '& .MuiTableCell-root': {
              color: '#333',
              fontFamily: 'Poppins, sans-serif',
            },
          }}
        />
      </Paper>

      <AddEditModal
        open={open}
        user={user}
        handleSaveEvent={(response) => {
          fetchUsers();
          setOpen(false);
          toast(user ? t('User updated successfully') : t('User created successfully'), {
            type: 'success',
          });
        }}
        handleClose={() => setOpen(false)}
      />
    </Box>
  );
}

export default Users;
