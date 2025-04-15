'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getDashboardStats } from 'services/admin.service';
import PeopleIcon from '@mui/icons-material/People';
import PostAddIcon from '@mui/icons-material/PostAdd';
import ReportIcon from '@mui/icons-material/Report';
import { Box, Container, Grid, Paper, Typography } from '@mui/material';
import PageTitle from 'components/atoms/PageTitle';

function Dashboard() {
  const { t } = useTranslation();
  const [stats, setStats] = useState({
    total_users: 0,
    new_users: 0,
    total_memes: 0,
    reported_memes: 0,
    active_users: 0,
    banned_users: 0,
    reported_comments: 0,
    active_users_today: 0,
    new_memes_today: 0,
    reported_content_today: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await getDashboardStats();
        console.log('📡 Raw API Data:', response); // Log the entire response

        if (response && response.data) {
          // Accessing data from the nested object
          const { data } = response;
          if (data && Object.keys(data).length > 0) {
            setStats((prevStats) => {
              const updated = {
                ...prevStats,
                ...Object.fromEntries(
                  Object.entries(data).filter(([_, v]) => v !== null && v !== undefined)
                ),
              };
              console.log('✅ Updated stats state:', updated);
              return updated;
            });
          }
        }
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();

    // Set up auto-refresh every 5 minutes
    const refreshInterval = setInterval(fetchStats, 5 * 60 * 1000);

    return () => clearInterval(refreshInterval);
  }, []);

  if (loading) {
    return (
      <Container
        disableGutters
        component="main"
        sx={{ pt: 4, pb: 6, backgroundColor: '#ECEFF1', minHeight: '100vh' }}
      >
        <Box
          sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}
        >
          <Typography variant="h5">Loading dashboard data...</Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container
        disableGutters
        component="main"
        sx={{ pt: 4, pb: 6, backgroundColor: '#ECEFF1', minHeight: '100vh' }}
      >
        <Box
          sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}
        >
          <Typography variant="h5" color="error">
            Error: {error}
          </Typography>
        </Box>
      </Container>
    );
  }

  const widgets = [
    {
      label: t('pages.dashboard.new_users'),
      value: stats.new_users,
      icon: <PeopleIcon sx={{ color: '#512DA8' }} />,
    },
    {
      label: t('pages.dashboard.total_users'),
      value: stats.total_users,
      icon: <PeopleIcon sx={{ color: '#512DA8' }} />,
    },
    {
      label: t('pages.dashboard.banned_users'),
      value: stats.banned_users,
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
      label: t('pages.dashboard.reported_comments'),
      value: stats.reported_comments,
      icon: <ReportIcon sx={{ color: '#512DA8' }} />,
    },
  ];

  // User Engagement Overview
  const userEngagement = [
    {
      label: 'Active Users Today',
      value: stats.active_users_today,
      icon: <PeopleIcon sx={{ color: '#512DA8' }} />,
    },
    {
      label: 'New Memes Posted Today',
      value: stats.new_memes_today,
      icon: <PostAddIcon sx={{ color: '#512DA8' }} />,
    },
    {
      label: 'Reported Contents Today',
      value: stats.reported_content_today,
      icon: <ReportIcon sx={{ color: '#512DA8' }} />,
    },
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

      {/* User Engagement Overview Section */}
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
          {t('User Engagement Overview')}
        </Typography>
        <Grid container spacing={3}>
          {userEngagement.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
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
                    {item.label}
                  </Typography>
                  <Typography variant="h4" sx={{ color: '#512DA8', fontWeight: 'bold' }}>
                    {item.value}
                  </Typography>
                </Box>
                {item.icon}
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
}

export default Dashboard;
