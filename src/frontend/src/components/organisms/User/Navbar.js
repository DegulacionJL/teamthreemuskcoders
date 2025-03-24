'use client';

import { Link as RouterLink, useLocation } from 'react-router-dom';
import { DarkMode, LightMode, Notifications } from '@mui/icons-material';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  IconButton,
  Toolbar,
  Typography,
  useTheme,
} from '@mui/material';
import { useTheme as useCustomTheme } from '../../../theme/ThemeContext';

function Navbar() {
  const theme = useTheme();
  const { darkMode, toggleDarkMode } = useCustomTheme();
  const location = useLocation();

  const navItems = [
    { name: 'ABOUT', path: '/about' },
    { name: 'INQUIRY', path: '/inquiry' },
    { name: 'FAQ', path: '/faq' },
    { name: 'STYLEGUIDE', path: '/styleguide' },
    { name: 'MEME FEED', path: '/meme-feed' },
  ];

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: theme.palette.mode === 'dark' ? '#121824' : theme.palette.primary.main,
        boxShadow: 'none',
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          {/* Logo */}
          <RouterLink
            to="/"
            style={{
              textDecoration: 'none',
              color: 'inherit',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Typography
              variant="h5"
              noWrap
              sx={{
                fontWeight: 700,
                color: '#ffb300',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              MemeMa
              <span role="img" aria-label="laughing emoji">
                😂
              </span>
            </Typography>
          </RouterLink>

          {/* Navigation Links */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
            {navItems.map((item) => (
              <Button
                key={item.name}
                component={RouterLink}
                to={item.path}
                sx={{
                  color: location.pathname === item.path ? '#ffffff' : 'rgba(255, 255, 255, 0.7)',
                  fontWeight: location.pathname === item.path ? 700 : 400,
                  '&:hover': {
                    color: '#ffffff',
                  },
                }}
              >
                {item.name}
              </Button>
            ))}
          </Box>

          {/* Right Side Icons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton
              color="inherit"
              onClick={toggleDarkMode}
              sx={{ color: theme.palette.mode === 'dark' ? '#ffb300' : '#ffffff' }}
            >
              {darkMode ? <LightMode /> : <DarkMode />}
            </IconButton>
            <IconButton color="inherit">
              <Notifications />
            </IconButton>
            <Avatar sx={{ bgcolor: '#8a4fff' }}>JD</Avatar>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;
