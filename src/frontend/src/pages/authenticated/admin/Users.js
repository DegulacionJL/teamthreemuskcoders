import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { deleteUser, retrieveUser, searchUsers } from 'services/user.service';
import { CalendarMonth, Email, Info, Person, VerifiedUser, Work } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import {
  Avatar,
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  LinearProgress,
  Paper,
  Tooltip,
  Typography,
} from '@mui/material';
import DataTable from 'components/molecules/DataTable';
import AddEditModal from 'components/molecules/users/AddEditModal';
import { criteria, meta as defaultMeta } from 'config/search';

/* -------------------------------------------------------------------- */
export default function Users() {
  const { t } = useTranslation();

  /* --------------------------- state -------------------------------- */
  const [data, setData] = useState([]);
  const [user, setUser] = useState(null);
  const [detail, setDetail] = useState(null);
  const [query, setQuery] = useState(criteria);
  const [meta, setMeta] = useState(defaultMeta);
  const [openForm, setOpenForm] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  /* --------------------- fetch helpers & debounce ------------------- */

  const parseDate = (raw) => {
    if (!raw) return null;

    // ISO dates parse fine
    let ms = Date.parse(raw);

    // If still NaN and only digits, treat as Unix timestamp
    if (Number.isNaN(ms) && /^\d+$/.test(raw)) {
      ms = raw.length === 10 ? Number(raw) * 1000 : Number(raw); // sec vs ms
    }

    // If Laravel format, replace space with ‘T’
    if (Number.isNaN(ms)) {
      ms = Date.parse(raw.replace(' ', 'T'));
    }

    return Number.isNaN(ms) ? null : new Date(ms);
  };
  const debounceRef = useRef();

  const fetchUsers = async () => {
    if (isFetching) return;
    setIsFetching(true);
    try {
      const res = await searchUsers(query);
      setMeta(res.meta);
      setData(res.data);
    } catch (err) {
      console.error(err);
      toast(t('Unable to fetch users'), { type: 'error' });
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(fetchUsers, 300);
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const updateQuery = useCallback(
    (patch) =>
      setQuery((q) => {
        const next = { ...q, ...patch };
        return JSON.stringify(next) === JSON.stringify(q) ? q : next;
      }),
    []
  );

  /* ------------------------- memoised handlers ---------------------- */
  const handleChangePage = useCallback((_, value) => updateQuery({ page: value }), [updateQuery]);

  const handleSort = useCallback(
    (_, { order, sort }) => updateQuery({ order, sort }),
    [updateQuery]
  );

  const handleSearch = useCallback((kw) => updateQuery({ keyword: kw, page: 1 }), [updateQuery]);

  const handleRowClick = useCallback(
    async (row) => {
      try {
        const full = await retrieveUser(row.id);

        console.log('full user from API:', full);

        setDetail(full);
        setOpenDetail(true);
      } catch (err) {
        toast(t('Unable to load user details'), { type: 'error' });
        console.error(err);
      }
    },
    [t]
  );

  const handleEdit = useCallback(async (id) => {
    setUser(await retrieveUser(id));
    setOpenForm(true);
  }, []);

  const handleDelete = useCallback(
    async (id) => {
      if (confirm(t('Are you sure you want to delete this user?'))) {
        await deleteUser(id);
        toast(t('User deleted successfully'), { type: 'success' });
        fetchUsers();
      }
    },
    [t]
  );

  /* --------------------------- table spec --------------------------- */
  const headers = [
    {
      id: 'avatar',
      label: '',
      width: 64,
      render: (row) => {
        const rawAvatar = row?.avatar ?? ''; // If avatar is null or undefined, use an empty string
        console.log('Raw Avatar:', rawAvatar); // Log to debug

        // Determine the avatar URL based on whether the user has uploaded an avatar or not
        const avatarUrl = rawAvatar ? row.avatar : '/static/images/default-avatar.png';
        console.log('Final Avatar URL:', avatarUrl); // Log the final avatar URL for debugging

        return (
          <Avatar
            src={avatarUrl} // Use the avatarUrl here
            alt="Profile"
            sx={{
              width: 40,
              height: 40,
              mx: 'auto',
              border: '2px solid #888',
              boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
            }}
            onError={(e) => {
              // Fallback to default avatar if the image fails to load
              console.log('Image failed to load, falling back to default'); // Log when the image fails to load
              e.currentTarget.onerror = null;
              e.currentTarget.src = '/static/images/default-avatar.png'; // Fallback image
            }}
          />
        );
      },
    },

    {
      id: 'first_name',
      label: (
        <>
          <Person sx={{ verticalAlign: 'middle', color: '#ff7043' }} /> {t('First Name')}
        </>
      ),
      width: 160,
    },
    {
      id: 'last_name',
      label: (
        <>
          <Person sx={{ verticalAlign: 'middle', color: '#ff7043' }} /> {t('Last Name')}
        </>
      ),
      width: 160,
    },
    {
      id: 'email',
      label: (
        <>
          <Email sx={{ verticalAlign: 'middle', color: '#42a5f5' }} /> {t('Email Address')}
        </>
      ),
      width: 240,
    },
    {
      id: 'role',
      label: (
        <>
          <Work sx={{ verticalAlign: 'middle', color: '#66bb6a' }} /> {t('Role')}
        </>
      ),
      width: 120,
    },
    {
      id: 'status.name',
      label: (
        <>
          <VerifiedUser sx={{ verticalAlign: 'middle', color: '#ffca28' }} /> {t('Status')}
        </>
      ),
      width: 120,
    },
  ];

  /* ------------------------------ UI ------------------------------- */
  return (
    <Fragment>
      <Box
        sx={{
          backgroundColor: '#121212',
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
            borderRadius: 0,
            backgroundColor: '#333',
            boxShadow: 3,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              mb: 3,
              fontWeight: 'bold',
              color: '#81d4fa',
              fontFamily: 'Poppins, sans-serif',
            }}
          >
            {t('Manage Users')}
          </Typography>

          {isFetching && <LinearProgress sx={{ mb: 1 }} />}

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
            handleRowClick={handleRowClick}
            sx={{
              tableLayout: 'fixed',
              boxShadow: 2,
              borderRadius: 2,
              '& .MuiTableHead-root': {
                backgroundColor: '#1e293b',
                color: 'white',
              },
              '& .MuiTableRow-root:hover': { backgroundColor: '#424242' },
              '& .MuiTableCell-root': {
                color: '#e0e0e0',
                fontFamily: 'Poppins, sans-serif',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              },
            }}
          />
        </Paper>
      </Box>

      {/* ---------------------- Detail dialog ------------------------ */}
      <Dialog
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { backgroundColor: '#1e1e1e', color: 'white' } }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Info sx={{ color: '#81d4fa' }} /> {t('User Details')}
          <Box sx={{ flexGrow: 1 }} />
          <Tooltip title={t('Close')}>
            <IconButton onClick={() => setOpenDetail(false)} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </Tooltip>
        </DialogTitle>
        <DialogContent dividers>
          {detail && (
            <Grid container spacing={2}>
              <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
                <Avatar
                  src={detail?.avatar?.replace(/\\/g, '')}
                  alt="Profile"
                  sx={{ width: 100, height: 100, mx: 'auto' }}
                />
                <Typography mt={2} variant="h6">
                  {detail.first_name} {detail.last_name}
                </Typography>
                <Typography variant="body2" color="gray">
                  {detail.role}
                </Typography>
              </Grid>
              <Grid item xs={12} md={8}>
                <Box sx={{ display: 'flex', mb: 1 }}>
                  <Email sx={{ mr: 1 }} />
                  <Typography>{detail.email}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 1 }}>
                  <CalendarMonth sx={{ mr: 1 }} />
                  <Typography>
                    {t('Joined')}:&nbsp;
                    {new Date(detail.created_at).toLocaleDateString()}
                  </Typography>
                </Box>
                {detail.last_login_at ? (
                  <Box sx={{ display: 'flex', mb: 1 }}>
                    <VerifiedUser sx={{ mr: 1 }} />
                    <Typography>
                      {t('Last login')}:&nbsp;
                      {new Date(detail.last_login_at).toLocaleString() || t('Invalid Date')}
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', mb: 1 }}>
                    <VerifiedUser sx={{ mr: 1 }} />
                    <Typography>
                      {t('Last login')}: {t('Never logged in')}
                    </Typography>
                  </Box>
                )}
              </Grid>
            </Grid>
          )}
        </DialogContent>
      </Dialog>

      {/* -------------------- Add / Edit modal ----------------------- */}
      <AddEditModal
        open={openForm}
        user={user}
        handleSaveEvent={() => {
          fetchUsers();
          setOpenForm(false);
          toast(user ? t('User updated successfully') : t('User created successfully'), {
            type: 'success',
          });
        }}
        handleClose={() => setOpenForm(false)}
      />
    </Fragment>
  );
}
