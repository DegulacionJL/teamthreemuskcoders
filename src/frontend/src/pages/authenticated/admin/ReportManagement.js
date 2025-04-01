import React from 'react';
import {
  Box,
  Button,
  Container,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Typography,
} from '@mui/material';

const ReportManagement = () => {
  console.log('ReportManagement rendered'); // Check if component renders

  const [activeTab, setActiveTab] = React.useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const reports = [
    { id: 1, reportedBy: 'User123', date: '2025-04-01', status: 'Pending' },
    { id: 2, reportedBy: 'User456', date: '2025-04-02', status: 'Resolved' },
    { id: 3, reportedBy: 'User789', date: '2025-04-03', status: 'Pending' },
  ];

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

      {/* Tabs for switching between Report Types */}
      <Box sx={{ width: '100%', marginBottom: '20px' }}>
        <Tabs value={activeTab} onChange={handleTabChange} centered>
          <Tab label="Reported Memes" />
          <Tab label="Reported Comments" />
          <Tab label="Reported Users" />
        </Tabs>
      </Box>

      {/* Table to display reported items */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Report ID</TableCell>
              <TableCell>Reported By</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reports.map((report) => (
              <TableRow key={report.id}>
                <TableCell>{report.id}</TableCell>
                <TableCell>{report.reportedBy}</TableCell>
                <TableCell>{report.date}</TableCell>
                <TableCell>{report.status}</TableCell>
                <TableCell>
                  <Button variant="outlined" color="primary" sx={{ marginRight: '10px' }}>
                    Resolve
                  </Button>
                  <Button variant="outlined" color="error">
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default ReportManagement;
