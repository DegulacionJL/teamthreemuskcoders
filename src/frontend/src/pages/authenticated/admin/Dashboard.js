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
      icon: <PeopleIcon sx={{ color: '#4caf50' }} />,
    },
    {
      label: t('pages.dashboard.total_users'),
      value: stats.total_users,
      icon: <PeopleIcon sx={{ color: '#1976d2' }} />,
    },
    {
      label: t('pages.dashboard.active_users'),
      value: stats.active_users,
      icon: <PeopleIcon sx={{ color: '#ff9800' }} />,
    },
    {
      label: t('pages.dashboard.total_memes'),
      value: stats.total_memes,
      icon: <PostAddIcon sx={{ color: '#673ab7' }} />,
    },
    {
      label: t('pages.dashboard.reported_memes'),
      value: stats.reported_memes,
      icon: <ReportIcon sx={{ color: '#f44336' }} />,
    },
    {
      label: t('pages.dashboard.banned_users'),
      value: stats.banned_users,
      icon: <ReportIcon sx={{ color: '#e91e63' }} />,
    },
  ];

  const recentActivities = [
    'User Arya Stark registered',
    'Meme #1234 was reported',
    'Admin updated user permissions',
    'User Daenerys Targaryen uploaded a new meme',
    'User Jon Snow was banned',
    'User Tyrion Lannister updated profile',
    'User Sansa Stark deleted account',
    'User Cersei Lannister uploaded a new meme',
  ];

  return (
    <Container
      disableGutters
      component="main"
      sx={{ pt: 4, pb: 6, backgroundColor: '#f4f6f8', minHeight: '100vh' }}
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
                elevation={4}
                sx={{
                  p: 3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderRadius: 3,
                  backgroundColor: 'white',
                  boxShadow: '0 3px 10px rgba(0,0,0,0.1)',
                }}
              >
                <Box>
                  <Typography variant="h6" sx={{ color: '#333', fontWeight: 'bold' }}>
                    {widget.label}
                  </Typography>
                  <Typography variant="h4" sx={{ color: '#1976d2', fontWeight: 'bold' }}>
                    {widget.value}
                  </Typography>
                </Box>
                {widget.icon}
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Recent Activities Section */}
      <Box
        sx={{
          mt: 6,
          p: 4,
          backgroundColor: 'white',
          borderRadius: 3,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }}
      >
        <Typography variant="h6" sx={{ mb: 3, color: '#333', fontWeight: 'bold' }}>
          {t('Recent Activities')}
        </Typography>
        <List
          sx={{
            maxHeight: 250,
            overflowY: 'auto',
            backgroundColor: '#fafafa',
            borderRadius: 2,
            p: 2,
          }}
        >
          {recentActivities.map((activity, index) => (
            <ListItem key={index} sx={{ borderBottom: '1px solid #ddd' }}>
              <ListItemIcon>
                <AssignmentIcon sx={{ color: '#1976d2' }} />
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
