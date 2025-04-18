import PropTypes from 'prop-types';
import { List, styled } from '@mui/material';
import MuiDrawer from '@mui/material/Drawer';
import { blueGrey } from '@mui/material/colors';
import { SidebarMenu } from 'components/molecules/SidebarMenuUser';

const drawerWidth = 240; // Full width when expanded
const collapsedWidth = 48; // Just enough for icons

const Drawer = styled(MuiDrawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    position: 'absolute',
    top: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: collapsedWidth,
    backgroundColor: theme.palette.mode === 'dark' ? blueGrey[900] : blueGrey[50], // Dynamic color
    color: theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.text.primary,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: 'border-box',
    overflowX: 'hidden',

    '&:hover': {
      width: drawerWidth,
    },
  },
}));

function SidebarPost() {
  return (
    <Drawer variant="permanent">
      <List
        component="nav"
        sx={{ p: 0, m: 0, display: 'flex', flexDirection: 'column', gap: 2, color: 'white' }}
      >
        {' '}
        {/* Remove padding/margin */}
        <SidebarMenu />
      </List>
    </Drawer>
  );
}

SidebarPost.propTypes = {
  onToggle: PropTypes.func,
};

export default SidebarPost;
