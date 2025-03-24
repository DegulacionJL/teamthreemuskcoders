import PropTypes from 'prop-types';
import React from 'react';
import { Box } from '@mui/material';
import ActionIconButton from '../atoms/ActionIconButton';

const CommentActions = ({ onEdit, onDelete }) => {
  return (
    <Box>
      <ActionIconButton icon="✏️" size="small" onClick={onEdit} />
      <ActionIconButton icon="🗑️" size="small" onClick={onDelete} />
    </Box>
  );
};

CommentActions.propTypes = {
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default CommentActions;
