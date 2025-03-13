import PropTypes from 'prop-types';
import React from 'react';

function ImagePreview({ image, onRemove }) {
  return (
    <div>
      {image && <img src={image} alt="Preview" style={{ width: '100%', borderRadius: '8px' }} />}
      {image && <button onClick={onRemove}>Remove Image</button>}
    </div>
  );
}

ImagePreview.propTypes = {
  image: PropTypes.string.isRequired,
  onRemove: PropTypes.func.isRequired,
};

export default ImagePreview;
