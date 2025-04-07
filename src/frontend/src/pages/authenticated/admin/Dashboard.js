import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getDashboardStats } from 'services/admin.service';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PeopleIcon from '@mui/icons-material/People';
import PostAddIcon from '@mui/icons-material/PostAdd';
import ReportIcon from '@mui/icons-material/Report';
import {
  Box,
  Container,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material';
import PageTitle from 'components/atoms/PageTitle';

function Dashboard() {
  const { t } = useTranslation();
  const [stats, setStats] = useState({
    total_users: 0,
    total_memes: 0,
    reported_memes: 0,
    active_users: 0,
    banned_users: 0,
  });

  useEffect(() => {
    getDashboardStats()
      .then((data) => setStats(data))
      .catch((error) => console.error('Error fetching stats:', error));
  }, []);

  const widgets = [
    {
      label: t('pages.dashboard.new_users'),
      value: stats.total_users,
      icon: <PeopleIcon sx={{ color: '#512DA8' }} />,
    },
    {
      label: t('pages.dashboard.total_users'),
      value: stats.total_users,
      icon: <PeopleIcon sx={{ color: '#512DA8' }} />,
    },
    {
      label: t('pages.dashboard.active_users'),
      value: stats.active_users,
      icon: <PeopleIcon sx={{ color: '#512DA8' }} />,
    },
    {
      label: t('pages.dashboard.total_memes'),
      value: stats.total_memes,
      icon: <PostAddIcon sx={{ color: '#512DA8' }} />,
    },
    {
      label: t('pages.dashboard.reported_memes'),
      value: stats.reported_memes,
      icon: <ReportIcon sx={{ color: '#512DA8' }} />,
    },
    {
      label: t('pages.dashboard.banned_users'),
      value: stats.banned_users,
      icon: <ReportIcon sx={{ color: '#512DA8' }} />,
    },
  ];

  const adminActivities = [
    'Admin John Doe approved a meme',
    'Moderator Jane Smith reviewed a report',
    'Admin Mark Lee updated user permissions',
    'Moderator Anna Davis banned a user',
    'Admin Michael Brown deleted an inappropriate meme',
    'Moderator Emily White issued a warning',
  ];

  return (
    <Container
      disableGutters
      component="main"
      sx={{ pt: 4, pb: 6, backgroundColor: '#ECEFF1', minHeight: '100vh' }}
    >
      <PageTitle
        title={t('pages.dashboard.main_heading')}
        subTitle={t('pages.dashboard.sub_heading')}
      />

      {/* Widgets Section */}
      <Box sx={{ flexGrow: 1, mt: 4 }}>
        <Grid container spacing={3}>
          {widgets.map((widget, key) => (
            <Grid item xs={12} sm={6} md={4} key={key}>
              <Paper
                elevation={6}
                sx={{
                  p: 3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderRadius: 3,
                  backgroundColor: 'white',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  transition: 'transform 0.2s, background-color 0.2s',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    backgroundColor: '#F3E5F5',
                  },
                }}
              >
                <Box>
                  <Typography variant="h6" sx={{ color: '#333', fontWeight: 'bold' }}>
                    {widget.label}
                  </Typography>
                  <Typography variant="h4" sx={{ color: '#512DA8', fontWeight: 'bold' }}>
                    {widget.value}
                  </Typography>
                </Box>
                {widget.icon}
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Admin/Moderator Recent Activities Section */}
      <Box
        sx={{
          mt: 6,
          p: 4,
          backgroundColor: 'white',
          borderRadius: 3,
          boxShadow: '0 6px 15px rgba(0,0,0,0.25)',
        }}
      >
        <Typography
          variant="h5"
          sx={{ mb: 3, color: 'black', fontWeight: 'bold', textAlign: 'center' }}
        >
          {t('Admin and Moderator Recent Activities')}
        </Typography>
        <List
          sx={{
            maxHeight: 500,
            overflowY: 'auto',
            backgroundColor: '#F5F5F5',
            borderRadius: 2,
            p: 2,
            boxShadow: 'inset 0 0 8px rgba(0,0,0,0.1)',
          }}
        >
          {adminActivities.map((activity, index) => (
            <ListItem
              key={index}
              sx={{
                borderBottom: '1px solid #E0E0E0',
                '&:last-child': { borderBottom: 'none' },
                p: 2,
                borderRadius: 2,
                backgroundColor: 'white',
                mb: 1,
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                transition: 'background-color 0.2s',
                '&:hover': {
                  backgroundColor: '#EDE7F6',
                },
              }}
            >
              <ListItemIcon>
                <AssignmentIcon sx={{ color: '#512DA8' }} />
              </ListItemIcon>
              <ListItemText
                primary={activity}
                primaryTypographyProps={{ sx: { fontWeight: 'bold', color: '#333' } }}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Container>
  );
}

export default Dashboard;
