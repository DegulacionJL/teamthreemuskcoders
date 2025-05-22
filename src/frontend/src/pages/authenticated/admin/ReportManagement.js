// import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { getReportedMemes } from 'services/admin.service';
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
  const [activeTab, setActiveTab] = useState(0);
  const [reports, setReports] = useState([]);
  const [data, setData] = useState(null);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const fetchReportedMemes = async () => {
    const response = await getReportedMemes();
    setData(response);
  };
  useEffect(() => {
    // axios
    //   .get('http://localhost:8000/api/admin/reports')
    //   .then((response) => {
    //     console.log('Reports from API:', response.data);
    //     setReports(response.data);
    //   })
    //   .catch((error) => {
    //     console.error('Error fetching reports:', error);
    //   });
    fetchReportedMemes();
  }, []);

  const filteredReports = reports.filter((report) => {
    if (activeTab === 0) return report.type === 'Meme';
    if (activeTab === 1) return report.type === 'Comment';
    if (activeTab === 2) return report.type === 'User';
    return false;
  });

  return (
    <Container
      sx={{ padding: '20px', backgroundColor: 'black', borderRadius: '8px', boxShadow: 3 }}
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
          <TableHead sx={{ backgroundColor: '#482880' }}>
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
            {filteredReports?.length || data?.length > 0 ? (
              data.map((report) => (
                <TableRow key={report.id} hover>
                  <TableCell align="center">{report.id}</TableCell>
                  <TableCell align="center">{report.reported_by}</TableCell>
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
