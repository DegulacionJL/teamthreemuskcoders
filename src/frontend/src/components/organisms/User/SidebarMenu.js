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

const links = [
  {
    label: 'Dashboard',
    path: '/admin',
    icon: <DashboardIcon sx={{ color: 'white' }} />, // Set color to white
  },
  {
    label: 'Users',
    path: '/admin/users',
    icon: <PeopleIcon sx={{ color: 'white' }} />,
  },
  {
    label: 'Roles',
    path: '/admin/roles',
    icon: <RoomPreferencesIcon sx={{ color: 'white' }} />,
  },
  // DEMO PURPOSES ONLY. REMOVE ON ACTUAL PROJECT
  {
    label: 'Broadcast',
    path: '/admin/broadcast',
    icon: <CampaignIcon sx={{ color: 'white' }} />,
  },
  {
    label: 'Integrations',
    path: '/admin/integrations',
    icon: <LayersIcon sx={{ color: 'white' }} />,
  },
];

function SidebarMenu() {
  const location = useLocation();
  const { t } = useTranslation();
  const localizeLinks = [...links];

  // add localization to menu items
  localizeLinks.map((link) => {
    link.label = t(`menu.${link.path.replace('/admin/', '')}`);
    return link;
  });

  return (
    <>
      {localizeLinks.map((item, key) => (
        <ListItemButton
          key={key}
          component={Link}
          to={item.path}
          selected={location.pathname === item.path}
        >
          <ListItemIcon sx={{ color: 'white' }}>{item.icon}</ListItemIcon>{' '}
          {/* Ensure icons are white */}
          <ListItemText
            primary={
              <Typography variant="body2" sx={{ color: 'white' }}>
                {' '}
                {/* Text also white */}
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
