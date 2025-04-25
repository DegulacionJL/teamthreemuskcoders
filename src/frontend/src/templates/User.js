import { useCallback, useEffect } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';
import { logout } from 'services/auth';
import { setProfile } from 'store/slices/profileSlice';
import { Box } from '@mui/material';
import Navbar from 'components/organisms/User/Navbar';
import api from 'utils/api';

// Utility for debouncing
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    return new Promise((resolve) => {
      timeout = setTimeout(() => resolve(func(...args)), wait);
    });
  };
};

// Utility for retry with exponential backoff
const retryWithBackoff = async (fn, retries = 3, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (error.response?.status === 429 && i < retries - 1) {
        const waitTime = delay * Math.pow(2, i); // Exponential backoff
        await new Promise((resolve) => setTimeout(resolve, waitTime));
        continue;
      }
      throw error;
    }
  }
};

// Cache utility
const CACHE_KEY = 'cached_profile';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const getCachedProfile = () => {
  const cached = localStorage.getItem(CACHE_KEY);
  if (!cached) return null;
  const { data, timestamp } = JSON.parse(cached);
  if (Date.now() - timestamp > CACHE_DURATION) {
    localStorage.removeItem(CACHE_KEY);
    return null;
  }
  return data;
};

const setCachedProfile = (profile) => {
  localStorage.setItem(CACHE_KEY, JSON.stringify({ data: profile, timestamp: Date.now() }));
};

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

  const fetchProfile = useCallback(async () => {
    try {
      const user = await retryWithBackoff(() => api.get('/profile').then((res) => res.data.data));
      dispatch(setProfile(user));
      setCachedProfile(user); // Cache the profile
    } catch (error) {
      if (location.pathname.includes('login')) {
        return; // Prevent too many redirects
      }
      if (error.response?.status === 429) {
        console.warn('Rate limit exceeded, please try again later.');
      } else {
        navigate(`/login?redirect_to=${location.pathname}`);
      }
    }
  }, [dispatch, navigate]);

  const debouncedFetchProfile = useCallback(debounce(fetchProfile, 1000), [fetchProfile]);

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) return;

    const cachedProfile = getCachedProfile();
    if (cachedProfile) {
      dispatch(setProfile(cachedProfile)); // Use cached profile
      return;
    }

    debouncedFetchProfile(); // Fetch if no valid cache
  }, [debouncedFetchProfile, dispatch]);

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
    </Box>
  );
}
