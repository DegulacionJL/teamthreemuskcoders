'use client';

import { LocalFireDepartment, PhotoCamera, Star, ThumbUp, TrendingUp } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material';

const LeftContent = () => {
  const theme = useTheme();

  const categories = [
    { id: 1, name: 'Popular Memes', icon: <LocalFireDepartment color="primary" />, active: true },
    { id: 2, name: 'Trending Now', icon: <TrendingUp />, active: false },
    { id: 3, name: 'New Arrivals', icon: <Star />, active: false },
    { id: 4, name: 'Top Picks', icon: <ThumbUp />, active: false },
  ];

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '20%',
        position: 'sticky',
        top: 0,
        height: '100vh',
        pt: 2,
        display: { xs: 'none', md: 'block' },
      }}
    >
      <Card sx={{ mb: 3 }}>
        <CardHeader
          title="Meme Categories"
          sx={{
            bgcolor: theme.palette.mode === 'dark' ? '#4a3b6b' : theme.palette.primary.light,
            color: '#ffffff',
            py: 1.5,
          }}
        />
        <List disablePadding>
          {categories.map((category) => (
            <ListItemButton
              key={category.id}
              selected={category.active}
              sx={{
                borderLeft: category.active ? 4 : 0,
                borderColor: theme.palette.primary.main,
                pl: category.active ? 2 : 3,
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>{category.icon}</ListItemIcon>
              <ListItemText
                primary={category.name}
                primaryTypographyProps={{
                  fontWeight: category.active ? 'medium' : 'regular',
                }}
              />
            </ListItemButton>
          ))}
        </List>
      </Card>

      <Card>
        <CardHeader
          title="Daily Challenge"
          sx={{
            bgcolor: theme.palette.mode === 'dark' ? '#4a3b6b' : theme.palette.primary.light,
            color: '#ffffff',
            py: 1.5,
          }}
        />
        <CardContent>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              mb: 2,
              bgcolor: theme.palette.mode === 'dark' ? '#2a2a3a' : theme.palette.secondary.light,
              color: theme.palette.mode === 'dark' ? '#ffffff' : theme.palette.secondary.dark,
              borderRadius: 2,
            }}
          >
            <Typography variant="subtitle1" fontWeight="medium">
              Caption This!
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Create the funniest caption
            </Typography>
            <Box
              sx={{
                height: 120,
                bgcolor: theme.palette.mode === 'dark' ? '#1e1e2e' : theme.palette.background.paper,
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 1,
              }}
            >
              <PhotoCamera sx={{ fontSize: 40, color: theme.palette.text.disabled }} />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                color="primary"
                size="small"
                sx={{
                  bgcolor: '#ffb300',
                  color: '#000000',
                  '&:hover': {
                    bgcolor: '#ffa000',
                  },
                }}
              >
                Participate
              </Button>
            </Box>
          </Paper>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LeftContent;
