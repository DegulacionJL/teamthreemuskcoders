import React from 'react';
import { AccessTime, Person } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Card,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

const activityLogs = [
  {
    id: 1,
    admin: 'Daeneyra Targaryen',
    role: 'Admin',
    action: 'Suspended user @nightKing for violating content guidelines.',
    timestamp: 'April 7, 2025 – 09:50 AM',
  },
  {
    id: 2,
    admin: 'Jon Snow',
    role: 'Moderator',
    action: 'Deleted a comment from @whiteWalker.',
    timestamp: 'April 6, 2025 – 04:10 PM',
  },
  {
    id: 3,
    admin: 'Daenerys Targaryen',
    role: 'Admin',
    action: "Updated user @aryaStark's role to Moderator.",
    timestamp: 'April 5, 2025 – 01:23 PM',
  },
  {
    id: 4,
    admin: 'Tyrion Lannister',
    role: 'Moderator',
    action: 'Banned user @CerseiLannister for harassment.',
    timestamp: 'April 4, 2025 – 11:45 AM',
  },
  {
    id: 5,
    admin: 'Ser Jorah Mormont',
    role: 'Moderator',
    action: 'Deleted a post from @JaimeLannister.',
    timestamp: 'April 3, 2025 – 08:30 AM',
  },
];

const ActivityFeedPage = () => {
  return (
    <Box sx={{ p: 4 }}>
      <Typography
        variant="h4"
        sx={{
          fontWeight: 'bold',
          mb: 3,
          textAlign: 'center',
          color: '#333',
          textTransform: 'uppercase',
        }}
      >
        Admin & Moderator Activity Feed
      </Typography>

      <Card sx={{ borderRadius: 4, boxShadow: 3, p: 2 }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ textAlign: 'center', padding: 2 }}></TableCell>{' '}
              {/* Blank header for Avatar and User */}
              <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', color: '#512DA8' }}>
                Role
              </TableCell>
              <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', color: '#512DA8' }}>
                Action
              </TableCell>
              <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', color: '#512DA8' }}>
                Time
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {activityLogs.map((log) => (
              <TableRow
                key={log.id}
                sx={{
                  '&:hover': {
                    backgroundColor: '#f5f5f5',
                    cursor: 'pointer',
                  },
                  '&:nth-of-type(odd)': {
                    backgroundColor: '#f9f9f9',
                  },
                }}
              >
                <TableCell sx={{ textAlign: 'justify' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: '#ede7f6' }}>
                      <Person sx={{ color: '#512DA8' }} />
                    </Avatar>
                    <Typography sx={{ fontWeight: 'bold' }}>{log.admin}</Typography>{' '}
                    {/* Admin/Moderator Name */}
                  </Box>
                </TableCell>
                <TableCell sx={{ textAlign: 'justify' }}>
                  <Chip
                    label={log.role}
                    color={log.role === 'Admin' ? 'primary' : 'secondary'}
                    size="small"
                    sx={{
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                    }}
                  />
                </TableCell>
                <TableCell sx={{ textAlign: 'justify', fontWeight: 'medium' }}>
                  {log.action}
                </TableCell>
                <TableCell sx={{ textAlign: 'justify', whiteSpace: 'nowrap' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AccessTime fontSize="small" />
                    <Typography variant="body2">{log.timestamp}</Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </Box>
  );
};

export default ActivityFeedPage;
