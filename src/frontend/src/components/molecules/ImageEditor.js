import React from 'react';
import ImagePreview from 'components/atoms/ImagePreview';

function ImageEditor({ image, onImageChange, onImageRemove }) {
  return (
    <div>
      <input type="file" accept="image/*" onChange={onImageChange} />
      <ImagePreview image={image} onRemove={onImageRemove} />
    </div>
  );
}

export default ImageEditor;
