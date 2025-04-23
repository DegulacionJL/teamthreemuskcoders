'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getDashboardStats } from 'services/admin.service';
import BarChartIcon from '@mui/icons-material/BarChart';
import PeopleIcon from '@mui/icons-material/People';
import PostAddIcon from '@mui/icons-material/PostAdd';
import ReportIcon from '@mui/icons-material/Report';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { Box, Container, Grid, Paper, Typography } from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';
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
        if (response && response.data) {
          const { data } = response;
          if (data && Object.keys(data).length > 0) {
            setStats((prevStats) => ({
              ...prevStats,
              ...Object.fromEntries(
                Object.entries(data).filter(([_, v]) => v !== null && v !== undefined)
              ),
            }));
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
    const refreshInterval = setInterval(fetchStats, 5 * 60 * 1000);
    return () => clearInterval(refreshInterval);
  }, []);

  const iconColors = ['#FFD54F', '#4DB6AC', '#BA68C8', '#FF8A65', '#81C784', '#64B5F6'];

  const widgets = [
    {
      label: t('pages.dashboard.new_users'),
      value: stats.new_users,
      icon: <PeopleIcon sx={{ color: iconColors[0] }} />,
    },
    {
      label: t('pages.dashboard.total_users'),
      value: stats.total_users,
      icon: <PeopleIcon sx={{ color: iconColors[1] }} />,
    },
    {
      label: t('pages.dashboard.banned_users'),
      value: stats.banned_users,
      icon: <PeopleIcon sx={{ color: iconColors[2] }} />,
    },
    {
      label: t('pages.dashboard.total_memes'),
      value: stats.total_memes,
      icon: <PostAddIcon sx={{ color: iconColors[3] }} />,
    },
    {
      label: t('pages.dashboard.reported_memes'),
      value: stats.reported_memes,
      icon: <ReportIcon sx={{ color: iconColors[4] }} />,
    },
    {
      label: t('pages.dashboard.reported_comments'),
      value: stats.reported_comments,
      icon: <ReportIcon sx={{ color: iconColors[5] }} />,
    },
  ];

  const userEngagement = [
    {
      label: 'Active Users Today',
      value: stats.active_users_today,
      icon: <PeopleIcon sx={{ color: iconColors[0] }} />,
    },
    {
      label: 'New Memes Posted Today',
      value: stats.new_memes_today,
      icon: <PostAddIcon sx={{ color: iconColors[3] }} />,
    },
    {
      label: 'Reported Contents Today',
      value: stats.reported_content_today,
      icon: <ReportIcon sx={{ color: iconColors[5] }} />,
    },
  ];

  const averageMemesPerUser =
    stats.active_users_today > 0
      ? (stats.new_memes_today / stats.active_users_today).toFixed(2)
      : '0.00';

  const averageReportsPerUser =
    stats.active_users_today > 0
      ? (stats.reported_content_today / stats.active_users_today).toFixed(2)
      : '0.00';

  const engagementRate =
    stats.total_users > 0
      ? ((stats.active_users_today / stats.total_users) * 100).toFixed(2)
      : '0.00';

  const backgroundColor = '#121212';
  const cardColor = '#1E1E1E';
  const textPrimary = '#FFFFFF';
  const textSecondary = '#B0BEC5';

  const cardStyles = {
    p: 3,
    borderRadius: 3,
    backgroundColor: cardColor,
    color: textPrimary,
    boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    transition: 'transform 0.2s, background-color 0.2s',
    '&:hover': {
      transform: 'scale(1.05)',
      backgroundColor: '#2C2C2C',
    },
  };

  const insightBoxStyle = {
    p: 3,
    mt: 4,
    borderRadius: 3,
    backgroundColor: '#2C2C2C',
    color: textPrimary,
    boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
  };

  const insightItemStyle = {
    display: 'flex',
    alignItems: 'center',
    mb: 3,
    '& svg': {
      transition: 'transform 0.3s, color 0.3s',
      fontSize: 32,
      mr: 2,
    },
    '&:hover svg': {
      transform: 'scale(1.2)',
      color: '#FFCA28',
    },
  };

  const progressBarStyle = {
    mt: 1,
    height: 8,
    borderRadius: 5,
    backgroundColor: '#37474F',
    '& .MuiLinearProgress-bar': {
      backgroundColor: '#64B5F6',
    },
  };

  if (loading || error) {
    return (
      <Box
        component="main"
        sx={{ pt: 4, pb: 6, backgroundColor, minHeight: '100vh', width: '100%' }}
      >
        <Container maxWidth="xl">
          <Box
            sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}
          >
            <Typography variant="h5" color={error ? 'error' : textPrimary}>
              {error ? `Error: ${error}` : 'Loading dashboard data...'}
            </Typography>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box component="main" sx={{ pt: 4, pb: 6, backgroundColor, minHeight: '100vh', width: '100%' }}>
      <Container maxWidth="xl">
        <PageTitle
          title={t('pages.dashboard.main_heading')}
          subTitle={t('pages.dashboard.sub_heading')}
          sx={{ color: textPrimary }}
        />

        <Box sx={{ flexGrow: 1, mt: 10 }}>
          <Grid container spacing={3}>
            {widgets.map((widget, key) => (
              <Grid item xs={12} sm={6} md={4} key={key}>
                <Paper elevation={6} sx={cardStyles}>
                  <Box>
                    <Typography variant="h6" sx={{ color: textSecondary, fontWeight: 'bold' }}>
                      {widget.label}
                    </Typography>
                    <Typography variant="h4" sx={{ color: textPrimary, fontWeight: 'bold' }}>
                      {widget.value}
                    </Typography>
                  </Box>
                  {widget.icon}
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box
          sx={{
            mt: 6,
            p: 4,
            backgroundColor: cardColor,
            borderRadius: 3,
            boxShadow: '0 6px 15px rgba(0,0,0,0.5)',
          }}
        >
          <Typography
            variant="h5"
            sx={{ mb: 3, color: textPrimary, fontWeight: 'bold', textAlign: 'center' }}
          >
            {t('User Engagement Overview')}
          </Typography>
          <Grid container spacing={3}>
            {userEngagement.map((item, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Paper elevation={6} sx={cardStyles}>
                  <Box>
                    <Typography variant="h6" sx={{ color: textSecondary, fontWeight: 'bold' }}>
                      {item.label}
                    </Typography>
                    <Typography variant="h4" sx={{ color: textPrimary, fontWeight: 'bold' }}>
                      {item.value}
                    </Typography>
                  </Box>
                  {item.icon}
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* Insights Section */}
          <Box sx={insightBoxStyle}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              <BarChartIcon sx={{ mr: 1, verticalAlign: 'middle', color: '#F48FB1' }} />
              Engagement Insights
            </Typography>

            <Box sx={insightItemStyle}>
              <PostAddIcon sx={{ color: '#4FC3F7' }} />
              <Box sx={{ flex: 1 }}>
                <Typography>
                  Average memes per active user today: <strong>{averageMemesPerUser}</strong>
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(averageMemesPerUser * 10, 100)}
                  sx={progressBarStyle}
                />
              </Box>
            </Box>

            <Box sx={insightItemStyle}>
              <ReportIcon sx={{ color: '#E57373' }} />
              <Box sx={{ flex: 1 }}>
                <Typography>
                  Average reports per active user today: <strong>{averageReportsPerUser}</strong>
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(averageReportsPerUser * 10, 100)}
                  sx={progressBarStyle}
                />
              </Box>
            </Box>

            <Box sx={insightItemStyle}>
              <TrendingUpIcon sx={{ color: '#81C784' }} />
              <Box sx={{ flex: 1 }}>
                <Typography>
                  Engagement rate (active vs total users): <strong>{engagementRate}%</strong>
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={parseFloat(engagementRate)}
                  sx={progressBarStyle}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default Dashboard;
