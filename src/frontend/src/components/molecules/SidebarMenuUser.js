import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import CampaignIcon from '@mui/icons-material/Campaign';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LayersIcon from '@mui/icons-material/Layers';
import PeopleIcon from '@mui/icons-material/People';
import RoomPreferencesIcon from '@mui/icons-material/RoomPreferences';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

const links = [
  { label: 'User List', path: '/userlist', icon: <DashboardIcon /> },
  { label: 'Users', path: '/routes/users', icon: <PeopleIcon /> },
  { label: 'Roles', path: '/routes/roles', icon: <RoomPreferencesIcon /> },
  { label: 'Broadcast', path: '/routes/broadcast', icon: <CampaignIcon /> },
  { label: 'Integrations', path: '/routes/integrations', icon: <LayersIcon /> },
];

function SidebarMenu() {
  const theme = useTheme(); // Get theme
  const location = useLocation();
  const { t } = useTranslation();
  const localizeLinks = links.map((link) => ({
    ...link,
    label: t(`menu.${link.path.split('/').pop()}`),
  }));

  const textColor =
    theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.text.primary;

  return (
    <>
      {localizeLinks.map((item, key) => (
        <ListItemButton
          key={key}
          component={Link}
          to={item.path}
          selected={location.pathname === item.path}
        >
          <ListItemIcon sx={{ color: textColor }}>{item.icon}</ListItemIcon>{' '}
          {/* Dynamic icon color */}
          <ListItemText
            primary={
              <Typography variant="body2" sx={{ color: textColor }}>
                {' '}
                {/* Dynamic text color */}
                {item.label}
              </Typography>
            }
          />
        </ListItemButton>
      ))}
    </>
  );
}

export { links, SidebarMenu };
