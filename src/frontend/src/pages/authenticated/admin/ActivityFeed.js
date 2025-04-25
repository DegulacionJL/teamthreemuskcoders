import React, { useMemo, useState } from 'react';
import { AccessTime, BarChart, Person } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';

const activityLogs = [
  {
    id: 1,
    admin: 'Daenerys Targaryen',
    role: 'Admin',
    type: 'Suspend',
    action: 'Suspended user @nightKing for violating content guidelines.',
    timestamp: '2025-04-07T09:50:00',
    extraDetails: 'Repeated rule violations',
  },
  {
    id: 2,
    admin: 'Jon Snow',
    role: 'Moderator',
    type: 'Delete',
    action: 'Deleted a comment from @whiteWalker.',
    timestamp: '2025-04-06T16:10:00',
    extraDetails: 'Offensive language',
  },
  {
    id: 3,
    admin: 'Daenerys Targaryen',
    role: 'Admin',
    type: 'Role',
    action: "Updated user @aryaStark's role to Moderator.",
    timestamp: '2025-04-05T13:23:00',
    extraDetails: 'Promotion for help',
  },
  {
    id: 4,
    admin: 'Tyrion Lannister',
    role: 'Moderator',
    type: 'Ban',
    action: 'Banned user @CerseiLannister for harassment.',
    timestamp: '2025-04-04T11:45:00',
    extraDetails: 'Harassment',
  },
  {
    id: 5,
    admin: 'Ser Jorah Mormont',
    role: 'Moderator',
    type: 'Delete',
    action: 'Deleted a post from @JaimeLannister.',
    timestamp: '2025-04-03T08:30:00',
    extraDetails: 'Explicit content',
  },
];

export default function ActivityFeedPage() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const stats = useMemo(() => {
    const total = activityLogs.length;
    const today = activityLogs.filter(
      (l) => new Date(l.timestamp).toDateString() === new Date().toDateString()
    ).length;
    const byType = activityLogs.reduce((a, c) => ((a[c.type] = (a[c.type] || 0) + 1), a), {});
    return { total, today, byType };
  }, []);
  return (
    <Box sx={{ p: 4, bgcolor: '#121212', minHeight: '100vh', color: '#e0e0e0' }}>
      <Card sx={{ borderRadius: 1, bgcolor: '#1e1e1e', p: 2, boxShadow: 4 }}>
        <Typography variant="h5" sx={{ color: '#b39ddb', mb: 2, fontWeight: 600 }}>
          Admin & Moderator Activity Feed
        </Typography>
        <Table>
          <TableHead>
            <TableRow sx={{ '& th': { color: '#b39ddb', fontWeight: 600 } }}>
              <TableCell>Admin</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Action</TableCell>
              <TableCell>Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {activityLogs.map((l) => (
              <TableRow
                key={l.id}
                hover
                sx={{ cursor: 'pointer', '&:hover': { bgcolor: '#272727' } }}
                onClick={() => {
                  setSelected(l);
                  setOpen(true);
                }}
              >
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ bgcolor: '#673ab7', width: 32, height: 32 }}>
                      <Person />
                    </Avatar>
                    <Typography>{l.admin}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip label={l.role} size="small" sx={{ bgcolor: '#512da8', color: '#fff' }} />
                </TableCell>
                <TableCell>
                  <Tooltip title={l.action}>
                    <Typography noWrap sx={{ maxWidth: 260 }}>
                      {l.action}
                    </Typography>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <AccessTime fontSize="inherit" />
                    <Typography variant="body2">
                      {new Date(l.timestamp).toLocaleString()}
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Summary Section */}
      <Grid container spacing={2} sx={{ mt: 3 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, bgcolor: '#1e1e1e' }}>
            <Typography sx={{ color: '#b39ddb', mb: 1 }}>
              <BarChart fontSize="small" /> Total Activities
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {stats.total}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, bgcolor: '#1e1e1e' }}>
            <Typography sx={{ color: '#b39ddb', mb: 1 }}>
              <BarChart fontSize="small" /> Today
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {stats.today}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, bgcolor: '#1e1e1e' }}>
            <Typography sx={{ color: '#b39ddb', mb: 1 }}>
              <BarChart fontSize="small" /> By Type
            </Typography>
            {Object.entries(stats.byType).map(([k, v]) => (
              <Typography key={k}>
                {k}: {v}
              </Typography>
            ))}
          </Paper>
        </Grid>
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle sx={{ bgcolor: '#512da8', color: '#fff' }}>Details</DialogTitle>
        <DialogContent sx={{ bgcolor: '#1e1e1e', color: '#e0e0e0' }}>
          {selected && (
            <>
              <Typography>
                <b>Admin:</b> {selected.admin}
              </Typography>
              <Typography>
                <b>Role:</b> {selected.role}
              </Typography>
              <Typography>
                <b>Type:</b> {selected.type}
              </Typography>
              <Typography sx={{ mt: 1 }}>{selected.extraDetails}</Typography>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ bgcolor: '#512da8' }}>
          <Button sx={{ color: '#fff' }} onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
