import { useEffect } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';
import { logout } from 'services/auth';
import { setProfile } from 'store/slices/profileSlice';
import { Box } from '@mui/material';
import Navbar from 'components/organisms/User/Navbar';
import api from 'utils/api';

export default function User() {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.profile.user);
  const toggleDrawer = () => setOpen(!open);

  const handleLogout = async () => {
    await logout();
    localStorage.clear();
    window.location = '/login?ref=logout';
  };

  const fetchProfile = async () => {
    const user = await api
      .get('/profile')
      .then((res) => res.data.data)
      .catch(() => {
        if (location.pathname.includes('login')) {
          return; // prevent too many redirects
        }
        navigate(`/login?redirect_to=${location.pathname}`);
      });
    dispatch(setProfile(user));
  };

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) fetchProfile();
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100vh' }}>
        <Navbar open={open} onToggle={toggleDrawer} onLogout={handleLogout} user={user} />

        <Box sx={{ display: 'flex', flexGrow: 1 }}>
          {/* Main content (Outlet will load here) */}
          <Box
            component="main"
            sx={{
              backgroundColor: (theme) =>
                theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
              pb: 8,
              minHeight: 'calc(100vh - 64px)', // Adjusted for navbar height
              flexGrow: 1, // Ensures it takes up remaining space
            }}
          >
            <Outlet />
          </Box>
        </Box>
      </Box>

      {/* <Footer /> */}
    </Box>
  );
}
