import React from 'react';
import { CheckCircle, Delete, Visibility } from '@mui/icons-material';
import {
  Box,
  Container,
  IconButton,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tooltip,
  Typography,
} from '@mui/material';

const ReportManagement = () => {
  const [activeTab, setActiveTab] = React.useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const reports = [
    {
      id: 1,
      type: 'Meme',
      reportedBy: 'User123',
      reason: 'Offensive Content',
      date: '2025-04-01',
      status: 'Pending',
    },
    {
      id: 2,
      type: 'Meme',
      reportedBy: 'User456',
      reason: 'Spam',
      date: '2025-04-02',
      status: 'Resolved',
    },
    {
      id: 3,
      type: 'Meme',
      reportedBy: 'User789',
      reason: 'Copyright Violation',
      date: '2025-04-03',
      status: 'Pending',
    },
    {
      id: 4,
      type: 'Meme',
      reportedBy: 'User321',
      reason: 'Misinformation',
      date: '2025-04-04',
      status: 'Pending',
    },
    {
      id: 5,
      type: 'Meme',
      reportedBy: 'User654',
      reason: 'Hate Speech',
      date: '2025-04-05',
      status: 'Resolved',
    },
    {
      id: 6,
      type: 'Comment',
      reportedBy: 'User111',
      reason: 'Harassment',
      date: '2025-04-06',
      status: 'Pending',
    },
    {
      id: 7,
      type: 'Comment',
      reportedBy: 'User222',
      reason: 'Offensive Language',
      date: '2025-04-07',
      status: 'Resolved',
    },
    {
      id: 8,
      type: 'Comment',
      reportedBy: 'User333',
      reason: 'Threats',
      date: '2025-04-08',
      status: 'Pending',
    },
    {
      id: 9,
      type: 'Comment',
      reportedBy: 'User444',
      reason: 'Spam',
      date: '2025-04-09',
      status: 'Resolved',
    },
    {
      id: 10,
      type: 'User',
      reportedBy: 'User555',
      reason: 'Impersonation',
      date: '2025-04-10',
      status: 'Pending',
    },
    {
      id: 11,
      type: 'User',
      reportedBy: 'User666',
      reason: 'Harassment',
      date: '2025-04-11',
      status: 'Resolved',
    },
    {
      id: 12,
      type: 'User',
      reportedBy: 'User777',
      reason: 'Fake Account',
      date: '2025-04-12',
      status: 'Pending',
    },
    {
      id: 13,
      type: 'User',
      reportedBy: 'User888',
      reason: 'Hate Speech',
      date: '2025-04-13',
      status: 'Resolved',
    },
  ];

  const filteredReports = reports
    .filter((report) => {
      if (activeTab === 0) return report.type === 'Meme';
      if (activeTab === 1) return report.type === 'Comment';
      if (activeTab === 2) return report.type === 'User';
      return false;
    })
    .map((report, index) => ({ ...report, id: index + 1 }));

  return (
    <Container
      sx={{ padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: 3 }}
    >
      <Typography variant="h4" gutterBottom>
        Report Management
      </Typography>
      <Typography variant="body1" paragraph>
        Manage all reported memes, comments, and users here. You can review and take action on any
        of the reported content.
      </Typography>

      <Box sx={{ width: '100%', marginBottom: '20px' }}>
        <Tabs value={activeTab} onChange={handleTabChange} centered>
          <Tab label="Reported Memes" />
          <Tab label="Reported Comments" />
          <Tab label="Reported Users" />
        </Tabs>
      </Box>

      <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: '8px' }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell align="center">Report ID</TableCell>
              <TableCell align="center">Reported By</TableCell>
              <TableCell align="center">Reason</TableCell>
              <TableCell align="center">Date</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredReports.length > 0 ? (
              filteredReports.map((report) => (
                <TableRow key={report.id} hover>
                  <TableCell align="center">{report.id}</TableCell>
                  <TableCell align="center">{report.reportedBy}</TableCell>
                  <TableCell align="center">{report.reason}</TableCell>
                  <TableCell align="center">{report.date}</TableCell>
                  <TableCell align="center">
                    <Typography
                      sx={{
                        color: report.status === 'Pending' ? 'orange' : 'green',
                        fontWeight: 'bold',
                      }}
                    >
                      {report.status}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="View Report">
                      <IconButton color="primary">
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Resolve Report">
                      <IconButton color="success">
                        <CheckCircle />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Report">
                      <IconButton color="error">
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell align="center" colSpan={6}>
                  No reports found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default ReportManagement;
