'use client';

import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import {
  Add as AddIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  Grid,
  IconButton,
  Paper,
  Typography,
} from '@mui/material';

const PhotosGrid = ({ userId, isCurrentUser }) => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  useEffect(() => {
    const fetchPhotos = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/timeline/users/${userId}/photos`);
        if (!response.ok) throw new Error('Failed to fetch photos');
        const data = await response.json();
        setPhotos(data);
      } catch (error) {
        console.error('Error fetching photos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, [userId]);

  const handlePhotoUpload = () => {
    // Implement photo upload logic
    console.log('Upload photo');
  };

  const openPhotoViewer = (index) => {
    setCurrentPhotoIndex(index);
    setViewerOpen(true);
  };

  const handleNext = () => {
    setCurrentPhotoIndex((prevIndex) => (prevIndex === photos.length - 1 ? 0 : prevIndex + 1));
  };

  const handlePrevious = () => {
    setCurrentPhotoIndex((prevIndex) => (prevIndex === 0 ? photos.length - 1 : prevIndex - 1));
  };

  return (
    <Box>
      <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" fontWeight="bold">
            Photos
          </Typography>
          {isCurrentUser && (
            <Button startIcon={<AddIcon />} variant="outlined" onClick={handlePhotoUpload}>
              Add Photos
            </Button>
          )}
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : photos.length > 0 ? (
          <Grid container spacing={2}>
            {photos.map((photo, index) => (
              <Grid item xs={6} sm={4} md={3} key={photo.id}>
                <Box
                  sx={{
                    paddingTop: '100%',
                    position: 'relative',
                    borderRadius: 1,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    '&:hover': {
                      opacity: 0.9,
                      transition: 'opacity 0.2s',
                    },
                  }}
                  onClick={() => openPhotoViewer(index)}
                >
                  <Box
                    component="img"
                    src={photo.url}
                    alt={photo.caption || `Photo ${index + 1}`}
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary" paragraph>
              No photos to show
            </Typography>
            {isCurrentUser && (
              <Button variant="contained" startIcon={<AddIcon />} onClick={handlePhotoUpload}>
                Add Your First Photo
              </Button>
            )}
          </Box>
        )}
      </Paper>

      <Dialog open={viewerOpen} onClose={() => setViewerOpen(false)} maxWidth="md" fullWidth>
        <Box sx={{ position: 'relative' }}>
          <IconButton
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              bgcolor: 'rgba(0,0,0,0.5)',
              color: 'white',
              zIndex: 1,
            }}
            onClick={() => setViewerOpen(false)}
          >
            <CloseIcon />
          </IconButton>

          <DialogContent
            sx={{
              p: 0,
              position: 'relative',
              height: '70vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {photos.length > 0 && (
              <Box
                component="img"
                src={photos[currentPhotoIndex].url}
                alt={photos[currentPhotoIndex].caption}
                sx={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                }}
              />
            )}

            <IconButton
              sx={{ position: 'absolute', left: 16, bgcolor: 'rgba(0,0,0,0.5)', color: 'white' }}
              onClick={handlePrevious}
            >
              <ArrowBackIcon />
            </IconButton>

            <IconButton
              sx={{ position: 'absolute', right: 16, bgcolor: 'rgba(0,0,0,0.5)', color: 'white' }}
              onClick={handleNext}
            >
              <ArrowForwardIcon />
            </IconButton>
          </DialogContent>

          <Box sx={{ p: 2 }}>
            <Typography variant="body1" fontWeight="medium">
              {photos.length > 0 && photos[currentPhotoIndex].caption}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {photos.length > 0 &&
                new Date(photos[currentPhotoIndex].createdAt).toLocaleDateString()}
            </Typography>
          </Box>
        </Box>
      </Dialog>
    </Box>
  );
};

PhotosGrid.propTypes = {
  userId: PropTypes.number.isRequired,
  isCurrentUser: PropTypes.bool.isRequired,
};

export default PhotosGrid;
