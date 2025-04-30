import PropTypes from 'prop-types';
import React from 'react';
import { Typography } from '@mui/material';
import { getRelativeTime } from 'utils/timeUtils';

const TimeDisplay = ({ timestamp, variant = 'caption', sx = { color: 'gray' } }) => {
  return (
    <Typography variant={variant} sx={sx}>
      {getRelativeTime(timestamp)}
    </Typography>
  );
};

TimeDisplay.propTypes = {
  timestamp: PropTypes.string.isRequired,
  variant: PropTypes.string,
  sx: PropTypes.object,
};

export default TimeDisplay;
