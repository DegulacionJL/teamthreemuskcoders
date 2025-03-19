import PropTypes from 'prop-types';
import React from 'react';
import ImageIcon from '@mui/icons-material/Image';
import { IconButton, Tooltip } from '@mui/material';

function ImageUploadButton({ onChange, disabled }) {
  const inputRef = React.useRef(null);

  const handleClick = () => {
    inputRef.current.click();
  };

  return (
    <>
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={onChange}
        style={{ display: 'none' }}
      />
      <Tooltip title="Add image">
        <IconButton onClick={handleClick} size="small" disabled={disabled} color="primary">
          <ImageIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </>
  );
}

ImageUploadButton.propTypes = {
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

export default ImageUploadButton;
