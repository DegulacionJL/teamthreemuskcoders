import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import {
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import {
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  Grid,
  IconButton,
  Paper,
  Typography,
} from '@mui/material';
import { toast } from 'react-toastify';
import api from 'utils/api';

const PhotosGrid = ({ userId, isCurrentUser }) => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  useEffect(() => {
    const fetchPhotos = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/timeline/users/${userId}/photos`);
        console.log('Photos API Response:', response.data);
        if (!response.data || !Array.isArray(response.data.data)) {
          throw new Error('Invalid photos data');
        }
        setPhotos(response.data.data);
      } catch (error) {
        console.error('Error fetching photos:', error);
        toast.error('Failed to load photos');
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, [userId]);

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
      {/* <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}> */}
      {/* <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
          Photos
        </Typography> */}

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
                  src={photo.image}
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
          <Typography variant="body1" color="text.secondary">
            No photos to show
          </Typography>
        </Box>
      )}
      {/* </Paper> */}

      {/* Photo Viewer Dialog */}
      <Dialog open={viewerOpen} onClose={() => setViewerOpen(false)} maxWidth="md" fullWidth>
        <Box sx={{ position: 'relative' }}>
          <IconButton
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              zIndex: 1,
              bgcolor: 'rgba(0,0,0,0.5)',
              color: 'white',
            }}
            onClick={() => setViewerOpen(false)}
          >
            <CloseIcon />
          </IconButton>
          {photos.length > 0 && (
            <DialogContent sx={{ p: 0, position: 'relative' }}>
              <Box
                component="img"
                src={photos[currentPhotoIndex].image}
                alt={photos[currentPhotoIndex].caption || `Photo ${currentPhotoIndex + 1}`}
                sx={{
                  width: '100%',
                  maxHeight: '80vh',
                  objectFit: 'contain',
                  display: 'block',
                  margin: 'auto',
                }}
              />
              {photos[currentPhotoIndex].caption && (
                <Typography
                  variant="body1"
                  sx={{
                    position: 'absolute',
                    bottom: 16,
                    left: 16,
                    color: 'white',
                    bgcolor: 'rgba(0,0,0,0.6)',
                    p: 1,
                    borderRadius: 1,
                  }}
                >
                  {photos[currentPhotoIndex].caption}
                </Typography>
              )}
              <IconButton
                sx={{
                  position: 'absolute',
                  left: 16,
                  bgcolor: 'rgba(0,0,0,0.5)',
                  color: 'white',
                  top: '50%',
                }}
                onClick={handlePrevious}
              >
                <ArrowBackIcon />
              </IconButton>
              <IconButton
                sx={{
                  position: 'absolute',
                  right: 16,
                  bgcolor: 'rgba(0,0,0,0.5)',
                  color: 'white',
                  top: '50%',
                }}
                onClick={handleNext}
              >
                <ArrowForwardIcon />
              </IconButton>
            </DialogContent>
          )}
        </Box>
      </Dialog>
    </Box>
  );
};

PhotosGrid.propTypes = {
  userId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  isCurrentUser: PropTypes.bool.isRequired,
};

export default PhotosGrid;
