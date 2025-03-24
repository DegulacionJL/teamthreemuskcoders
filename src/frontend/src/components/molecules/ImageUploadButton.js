import PropTypes from 'prop-types';
import React from 'react';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { Button, IconButton } from '@mui/material';

const ImageUploadButton = ({
  onChange,
  id,
  buttonVariant = 'icon',
  buttonText = 'Add Image',
  buttonProps = {},
}) => {
  return (
    <>
      <input accept="image/*" style={{ display: 'none' }} id={id} type="file" onChange={onChange} />
      <label htmlFor={id}>
        {buttonVariant === 'icon' ? (
          <IconButton component="span" color="primary" {...buttonProps}>
            <AddPhotoAlternateIcon />
          </IconButton>
        ) : (
          <Button
            component="span"
            variant="outlined"
            startIcon={<AddPhotoAlternateIcon />}
            {...buttonProps}
          >
            {buttonText}
          </Button>
        )}
      </label>
    </>
  );
};

ImageUploadButton.propTypes = {
  onChange: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  buttonVariant: PropTypes.oneOf(['icon', 'button']),
  buttonText: PropTypes.string,
  buttonProps: PropTypes.object,
};

export default ImageUploadButton;
