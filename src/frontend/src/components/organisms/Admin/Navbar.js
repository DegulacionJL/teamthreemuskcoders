import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import { IconButton, Toolbar, Typography, styled } from '@mui/material';
import MuiAppBar from '@mui/material/AppBar';
import { purple } from '@mui/material/colors';
import LanguageSelect from 'components/atoms/LanguageSelect';
import AvatarNavDropdown from 'components/molecules/AvatarNavDropdown';
import NotificationIcon from 'components/molecules/NotificationIcon';

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: purple[700],
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

function Navbar(props) {
  const { open, onToggle, user } = props;
  const location = useLocation();
  const [title, setTitle] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    const link = links.find((link) => link.path === location.pathname);
    if (link) setTitle(link.label);
  }, [location]);

  const links = [
    { label: t('menu.profile'), url: '/profile' },
    { label: t('menu.logout'), url: '/logout' },
  ];

  return (
    <AppBar position="absolute" open={open} elevation={0}>
      <Toolbar
        sx={{
          pr: '24px', // keep right padding when drawer closed
        }}
      >
        <IconButton
          edge="start"
          color="inherit"
          aria-label="open drawer"
          onClick={onToggle}
          sx={{
            marginRight: '36px',
            ...(open && { display: 'none' }),
          }}
        >
          <MenuIcon />
        </IconButton>
        <Typography component="h1" variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
          {title}
        </Typography>

        <LanguageSelect />

        <NotificationIcon user={user} darkMode={true} />

        <AvatarNavDropdown user={user} links={links} />
      </Toolbar>
    </AppBar>
  );
}

Navbar.propTypes = {
  open: PropTypes.bool,
  onToggle: PropTypes.func,
  onLogout: PropTypes.func,
  user: PropTypes.object,
};

export default Navbar;
