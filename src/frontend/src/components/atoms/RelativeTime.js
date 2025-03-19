import PropTypes from 'prop-types';
import React from 'react';
import { Typography } from '@mui/material';

const getRelativeTime = (timestamp) => {
  const now = new Date();
  const postedTime = new Date(timestamp);
  const diff = Math.floor((now - postedTime) / 1000);

  if (diff < 60) return 'Just now';
  if (diff < 3600) {
    const minutes = Math.floor(diff / 60);
    return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  }
  if (diff < 86400) {
    const hours = Math.floor(diff / 3600);
    return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  }
  const days = Math.floor(diff / 86400);
  return `${days} day${days === 1 ? '' : 's'} ago`;
};

const RelativeTime = ({ timestamp }) => (
  <Typography variant="caption" sx={{ color: 'gray' }}>
    {getRelativeTime(timestamp)}
  </Typography>
);

RelativeTime.propTypes = {
  timestamp: PropTypes.string.isRequired,
};

export default RelativeTime;
