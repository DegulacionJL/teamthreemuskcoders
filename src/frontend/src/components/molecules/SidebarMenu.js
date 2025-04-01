import { Link } from 'react-router-dom';
import CampaignIcon from '@mui/icons-material/Campaign';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LayersIcon from '@mui/icons-material/Layers';
import PeopleIcon from '@mui/icons-material/People';
import ReportIcon from '@mui/icons-material/Report';
import SecurityIcon from '@mui/icons-material/Security';
import { List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';

const SidebarMenu = () => {
  return (
    <List>
      <ListItemButton component={Link} to="/admin">
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItemButton>

      <ListItemButton component={Link} to="/admin/users">
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="Users" />
      </ListItemButton>

      <ListItemButton component={Link} to="/admin/roles">
        <ListItemIcon>
          <SecurityIcon />
        </ListItemIcon>
        <ListItemText primary="Roles" />
      </ListItemButton>

      <ListItemButton component={Link} to="/admin/reports">
        <ListItemIcon>
          <ReportIcon />
        </ListItemIcon>
        <ListItemText primary="Report Management" />
      </ListItemButton>

      <ListItemButton component={Link} to="/admin/broadcast">
        <ListItemIcon>
          <CampaignIcon />
        </ListItemIcon>
        <ListItemText primary="Broadcast" />
      </ListItemButton>

      <ListItemButton component={Link} to="/admin/integrations">
        <ListItemIcon>
          <LayersIcon />
        </ListItemIcon>
        <ListItemText primary="Integrations" />
      </ListItemButton>
    </List>
  );
};

export default SidebarMenu;
