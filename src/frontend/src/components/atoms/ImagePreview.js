import PropTypes from 'prop-types';
import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { Box, IconButton } from '@mui/material';

const ImagePreview = ({ src, onRemove, maxHeight = '100px', showRemoveButton = true }) => {
  return (
    <Box sx={{ mt: 1, position: 'relative', display: 'inline-block' }}>
      <img src={src} alt="Preview" style={{ maxHeight, borderRadius: '4px', maxWidth: '100%' }} />
      {showRemoveButton && (
        <IconButton
          size="small"
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            backgroundColor: 'rgba(255,255,255,0.7)',
          }}
          onClick={onRemove}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      )}
    </Box>
  );
};

ImagePreview.propTypes = {
  src: PropTypes.string.isRequired,
  onRemove: PropTypes.func,
  maxHeight: PropTypes.string,
  showRemoveButton: PropTypes.bool,
};

export default ImagePreview;
