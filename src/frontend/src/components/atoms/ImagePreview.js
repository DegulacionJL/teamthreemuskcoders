import PropTypes from 'prop-types';
import React from 'react';
import { Box } from '@mui/material';

function ImagePreview({ src, onRemove }) {
  return src ? (
    <Box position="relative" mb={1} mt={1}>
      <img
        src={src}
        alt="Comment attachment"
        style={{
          maxWidth: '100%',
          maxHeight: '150px',
          borderRadius: '4px',
          display: 'block',
        }}
      />
      {onRemove && (
        <Box
          position="absolute"
          top="5px"
          right="5px"
          bgcolor="rgba(0,0,0,0.5)"
          color="white"
          width="20px"
          height="20px"
          borderRadius="50%"
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{ cursor: 'pointer' }}
          onClick={onRemove}
        >
          ✕
        </Box>
      )}
    </Box>
  ) : null;
}

ImagePreview.propTypes = {
  src: PropTypes.string,
  onRemove: PropTypes.func,
};

export default ImagePreview;
