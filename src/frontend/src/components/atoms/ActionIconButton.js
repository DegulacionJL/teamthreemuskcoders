import PropTypes from 'prop-types';
import React from 'react';
import { IconButton } from '@mui/material';

const ActionIconButton = ({ icon, onClick, size = 'small', ...props }) => {
  return (
    <IconButton size={size} onClick={onClick} {...props}>
      {icon}
    </IconButton>
  );
};

ActionIconButton.propTypes = {
  icon: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
  size: PropTypes.string,
};

export default ActionIconButton;
