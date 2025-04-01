'use client';

import PropTypes from 'prop-types';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { logout } from 'services/auth';
import { Box, Container, Toolbar } from '@mui/material';
import Footer from 'components/organisms/Admin/Footer';
import Navbar from 'components/organisms/Admin/Navbar';
import Sidebar from 'components/organisms/Admin/Sidebar';

function Admin({ children }) {
  const [open, setOpen] = useState(true);
  const user = useSelector((state) => state.profile.user);
  const toggleDrawer = () => setOpen(!open);

  const handleLogout = async () => {
    await logout();
    localStorage.clear();
    window.location = '/login?ref=logout';
  };

  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      <Navbar open={open} onToggle={toggleDrawer} onLogout={() => handleLogout()} user={user} />

      <Sidebar open={open} onToggle={toggleDrawer} />

      <Box
        component="main"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
        }}
      >
        <Toolbar />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          {children || <Outlet />}

          <Footer />
        </Container>
      </Box>
    </Box>
  );
}

// ✅ Define PropTypes outside the component
Admin.propTypes = {
  children: PropTypes.node, // Allows any valid React child (components, strings, numbers, etc.)
};

export default Admin;
