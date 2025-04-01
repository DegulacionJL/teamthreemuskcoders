'use client';

import PropTypes from 'prop-types';
import { Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { purple } from '@mui/material/colors';
import Button from 'components/atoms/Button';
import LanguageSelect from 'components/atoms/LanguageSelect';
import MenuLinks from 'components/atoms/MenuLinks';
import AvatarNavDropdown from 'components/molecules/AvatarNavDropdown';
import NotificationIcon from 'components/molecules/NotificationIcon';
import { useTheme } from '../../../theme/ThemeContext';

function Navbar(props) {
  const { user = null } = props;
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [anchorMobileNav, setAnchorMobileNav] = useState(null);
  const { darkMode, toggleDarkMode } = useTheme();

  const menus = [];

  if (user) {
    menus.push({ label: t('menu.memefeed'), url: '/memefeed' });
    menus.push({ label: t('menu.userlist'), url: '/userList' });
  }

  const appName = process.env.REACT_APP_SITE_TITLE || 'MemeMa 😂';

  const handleOpenNavMenu = (event) => setAnchorMobileNav(event.currentTarget);
  const handleCloseNavMenu = (url) => {
    setAnchorMobileNav(null);
    navigate(url, { replace: true });
  };

  const links = [
    { label: t('menu.profile'), url: '/profile' },
    { label: t('menu.logout'), url: '/logout' },
  ];

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        backgroundColor: darkMode ? '#121824' : purple[700],
        transition: 'background-color 0.3s ease',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar sx={{ flexWrap: 'wrap' }} disableGutters>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <Link to="/">
              <Typography
                variant="h5"
                noWrap
                sx={{
                  fontWeight: 700,
                  color: '#ffb300',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  height: 48,
                }}
              >
                {appName}
              </Typography>
            </Link>
          </Box>

          <Box component="nav" sx={{ display: { xs: 'none', md: 'flex' } }}>
            <MenuLinks items={menus} />
          </Box>

          {/** Mobile Menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="main menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>

            <Box
              onClick={() => navigate('/')}
              sx={{
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                justifyContent: 'center',
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
                {appName}
              </Typography>
            </Box>

            <Menu
              id="menu-appbar"
              anchorEl={anchorMobileNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorMobileNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
              MenuListProps={{
                style: {
                  width: 200,
                },
              }}
            >
              {menus.map((menu, key) => (
                <MenuItem key={key} onClick={() => handleCloseNavMenu(menu.url)}>
                  <Typography textAlign="center">{menu.label}</Typography>
                </MenuItem>
              ))}

              {!user && (
                <Box>
                  <MenuItem onClick={() => handleCloseNavMenu('/signup')}>
                    <Typography textAlign="center">{t('labels.signup')}</Typography>
                  </MenuItem>

                  <MenuItem onClick={() => handleCloseNavMenu('/login')}>
                    <Typography textAlign="center">{t('labels.login')}</Typography>
                  </MenuItem>
                </Box>
              )}
            </Menu>
          </Box>

          <IconButton color="inherit" onClick={toggleDarkMode} sx={{ mr: 1 }}>
            {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>

          <LanguageSelect sx={{ ml: 1 }} />

          {user ? (
            <Fragment>
              <NotificationIcon user={user} />
              <AvatarNavDropdown user={user} links={links} />
            </Fragment>
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
              <Button component={Link} to="/signup" variant="outlined">
                {t('labels.signup')}
              </Button>

              <Button component={Link} to="/login">
                {t('labels.login')}
              </Button>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}

Navbar.propTypes = {
  onLogout: PropTypes.func,
  user: PropTypes.object,
};

export default Navbar;
