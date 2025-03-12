import PropTypes from 'prop-types';
import React, { useRef } from 'react';
import { Button } from '@mui/material';
import ImagePreview from 'components/atoms/ImagePreview';

function ImageEditor({ image, onImageChange, onImageRemove }) {
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={onImageChange}
        ref={fileInputRef}
        style={{ display: 'none' }}
      />
      <Button variant="contained" onClick={handleButtonClick}>
        Choose Image
      </Button>
      <ImagePreview image={image} onRemove={onImageRemove} />
    </div>
  );
}

ImageEditor.propTypes = {
  image: PropTypes.string,
  onImageChange: PropTypes.func.isRequired,
  onImageRemove: PropTypes.func.isRequired,
};

export default ImageEditor;
