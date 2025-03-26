import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { DarkMode, LightMode, Menu as MenuIcon, Notifications } from '@mui/icons-material';
import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from '@mui/material';
import AvatarNavDropdown from 'components/molecules/AvatarNavDropdown';
import { useTheme as useCustomTheme } from '../../../theme/ThemeContext';

function Navbar() {
  const { t } = useTranslation();
  const { darkMode, toggleDarkMode } = useCustomTheme();
  const location = useLocation();
  const [anchorMobileNav, setAnchorMobileNav] = useState(null);

  // Mock user data (replace with actual user logic)
  const user = useSelector((state) => state.profile.user);

  // Navigation menu items
  const menus = [
    { label: t('menu.header_about'), url: '/about' },
    { label: t('menu.inquiry'), url: '/inquiry' },
    { label: t('menu.faq'), url: '/faq' },
    { label: t('menu.styleguide'), url: '/styleguide' },
  ];

  if (user) {
    menus.push({ label: t('menu.memefeed'), url: '/memefeed' });
    menus.push({ label: t('menu.userlist'), url: '/userList' });
  }

  const links = [
    { label: t('menu.profile'), url: '/profile' },
    { label: t('menu.logout'), url: '/logout' },
  ];

  const handleOpenNavMenu = (event) => {
    setAnchorMobileNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorMobileNav(null);
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: darkMode ? '#121824' : '#8a4fff', // Updated color
        boxShadow: 'none',
        borderBottom: `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)'}`,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          {/* Mobile Menu Button */}
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton size="large" color="inherit" onClick={handleOpenNavMenu}>
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorMobileNav}
              open={Boolean(anchorMobileNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              {menus.map((item) => (
                <MenuItem key={item.label} onClick={handleCloseNavMenu}>
                  <Button
                    component={RouterLink}
                    to={item.url}
                    sx={{ color: darkMode ? '#ffffff' : '#000000' }} // Fixed dark mode color
                  >
                    {item.label}
                  </Button>
                </MenuItem>
              ))}
            </Menu>
          </Box>

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
              MemeMa 😂
            </Typography>
          </RouterLink>

          {/* Desktop Navigation Links */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
            {menus.map((item) => (
              <Button
                key={item.label}
                component={RouterLink}
                to={item.url}
                sx={{
                  color: location.pathname === item.url ? '#ffffff' : 'rgba(255, 255, 255, 0.7)',
                  fontWeight: location.pathname === item.url ? 700 : 400,
                  '&:hover': {
                    color: '#ffffff',
                  },
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>

          {/* Right Side Icons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton
              color="inherit"
              onClick={toggleDarkMode}
              sx={{ color: darkMode ? '#ffb300' : '#ffffff' }}
            >
              {darkMode ? <LightMode /> : <DarkMode />}
            </IconButton>
            <IconButton color="inherit">
              <Notifications />
            </IconButton>

            {/* Avatar Dropdown or Signup/Login Buttons */}
            {user ? (
              <AvatarNavDropdown user={user} links={links} />
            ) : (
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button component={RouterLink} to="/signup" variant="outlined">
                  {t('labels.signup')}
                </Button>
                <Button component={RouterLink} to="/login">
                  {t('labels.login')}
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;
