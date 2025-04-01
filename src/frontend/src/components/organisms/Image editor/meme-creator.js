'use client';

import { useState } from 'react';
import { Image as ImageIcon, PhotoCamera } from '@mui/icons-material';
import { Box, Button, Card, CardContent, Paper, Typography } from '@mui/material';
import ImageEditor from './image-editor';

function MemeCreator({ onSave, onCancel }) {
  const [image, setImage] = useState(null);
  const [editedImage, setEditedImage] = useState(null);
  const [caption, setCaption] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const handleImageUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = (event) => {
        if (event.target?.result) {
          setImage(event.target.result);
          setIsEditing(true);
        }
      };

      reader.readAsDataURL(file);
    }
  };

  const handleEditorSave = (editedImageDataUrl) => {
    setEditedImage(editedImageDataUrl);
    setIsEditing(false);
  };

  const handleSave = () => {
    if (editedImage) {
      onSave(editedImage, caption);
    }
  };

  const handleCancel = () => {
    setImage(null);
    setEditedImage(null);
    setCaption('');
    setIsEditing(false);
    if (onCancel) onCancel();
  };

  return (
    <Card sx={{ width: '100%', maxWidth: '800px', mx: 'auto' }}>
      <CardContent sx={{ p: 3 }}>
        {!image && !editedImage ? (
          <Paper
            elevation={0}
            sx={{
              p: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px dashed',
              borderColor: 'divider',
              borderRadius: 2,
              bgcolor: 'background.default',
            }}
          >
            <ImageIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Upload an image to create a meme
            </Typography>
            <Button
              variant="contained"
              component="label"
              startIcon={<PhotoCamera />}
              sx={{ mt: 2 }}
            >
              Upload Image
              <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
            </Button>
          </Paper>
        ) : isEditing && image ? (
          <ImageEditor
            imageUrl={image}
            onSave={handleEditorSave}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <Box sx={{ width: '100%' }}>
            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}
            >
              <Typography variant="h6">Preview</Typography>
              <Button variant="outlined" size="small" onClick={() => setIsEditing(true)}>
                Edit Image
              </Button>
            </Box>

            <Box
              sx={{ border: 1, borderColor: 'divider', borderRadius: 1, overflow: 'hidden', mb: 3 }}
            >
              <img
                src={editedImage || image || ''}
                alt="Meme preview"
                style={{ width: '100%', objectFit: 'contain', maxHeight: '500px' }}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <textarea
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  resize: 'none',
                  fontSize: '16px',
                  minHeight: '100px',
                  fontFamily: 'inherit',
                }}
                placeholder="Add a caption for your meme..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
              />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button variant="outlined" onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
                disabled={!editedImage}
              >
                Save Meme
              </Button>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

export default MemeCreator;
