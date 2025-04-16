'use client';

import PropTypes from 'prop-types';
import { PhotoCamera } from '@mui/icons-material';
import { Button, IconButton } from '@mui/material';

const ImageUploadButton = ({
  onChange,
  id = 'image-upload',
  buttonVariant = 'button',
  buttonText = 'Upload Image',
  buttonProps = {},
}) => {
  if (buttonVariant === 'icon') {
    return (
      <IconButton color="primary" aria-label="upload image" component="label" {...buttonProps}>
        <PhotoCamera />
        <input type="file" hidden id={id} accept="image/*" onChange={onChange} />
      </IconButton>
    );
  }

  return (
    <Button variant="outlined" component="label" startIcon={<PhotoCamera />} {...buttonProps}>
      {buttonText}
      <input type="file" hidden id={id} accept="image/*" onChange={onChange} />
    </Button>
  );
};

ImageUploadButton.propTypes = {
  onChange: PropTypes.func.isRequired,
  id: PropTypes.string,
  buttonVariant: PropTypes.oneOf(['button', 'icon']),
  buttonText: PropTypes.string,
  buttonProps: PropTypes.object,
};

export default ImageUploadButton;
