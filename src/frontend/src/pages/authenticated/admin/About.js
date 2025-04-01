import { Box, Paper, Typography } from '@mui/material';

export default function AdminAbout() {
  return (
    <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        About Admin Panel
      </Typography>
      <Box sx={{ mt: 2 }}>
        <Typography variant="body1" paragraph>
          This is the administration panel for MemeMa. This section provides tools for system
          administrators to manage users, content, and system settings.
        </Typography>
        <Typography variant="body1" paragraph>
          Only authorized administrators with the "System Admin" role can access this panel.
        </Typography>
      </Box>
    </Paper>
  );
}
