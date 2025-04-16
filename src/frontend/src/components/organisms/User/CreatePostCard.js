'use client';

import { PhotoCamera } from '@mui/icons-material';
import { Avatar, Box, Button, Card, CardContent, TextField, Typography } from '@mui/material';
import { useTheme } from '@mui/material';
import MemeCreator from '../Image editor/meme-creator';

const CreatePostCard = ({
  currentUser,
  caption,
  setCaption,
  imagePreview,
  setImagePreview,
  setImage,
  showMemeCreator,
  setShowMemeCreator,
  handlePost,
  handleMemeCreatorSave,
}) => {
  const theme = useTheme();

  return (
    <Card sx={{ width: '100%', mb: 3, maxWidth: '80%' }}>
      <CardContent>
        {showMemeCreator ? (
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar
                src={currentUser?.avatar || ''}
                sx={{ mr: 2 }}
                alt={`${currentUser?.first_name} ${currentUser?.last_name}`}
              >
                {currentUser
                  ? `${currentUser.first_name?.charAt(0).toUpperCase() || ''}${
                      currentUser.last_name?.charAt(0).toUpperCase() || ''
                    }`
                  : 'JD'}
              </Avatar>
              <Typography variant="h6">
                {currentUser
                  ? `${
                      currentUser.first_name?.charAt(0).toUpperCase() +
                      currentUser.first_name?.slice(1)
                    } ${
                      currentUser.last_name?.charAt(0).toUpperCase() +
                      currentUser.last_name?.slice(1)
                    }`
                  : 'John Degz'}
              </Typography>
            </Box>

            <MemeCreator
              onSave={handleMemeCreatorSave}
              onCancel={() => setShowMemeCreator(false)}
              inlineMode={true}
            />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button
                variant="outlined"
                onClick={() => setShowMemeCreator(false)}
                sx={{ mr: 2, borderRadius: 4 }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handlePost}
                disabled={!imagePreview}
                sx={{
                  borderRadius: 4,
                  bgcolor: '#8a4fff',
                  '&:hover': {
                    bgcolor: '#7a3fef',
                  },
                }}
              >
                POST
              </Button>
            </Box>
          </Box>
        ) : (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar
                src={currentUser?.avatar || ''}
                sx={{ mr: 2 }}
                alt={`${currentUser?.first_name} ${currentUser?.last_name}`}
              >
                {currentUser
                  ? `${currentUser.first_name?.charAt(0).toUpperCase() || ''}${
                      currentUser.last_name?.charAt(0).toUpperCase() || ''
                    }`
                  : 'JD'}
              </Avatar>
              <Typography variant="h6">
                {currentUser
                  ? `${
                      currentUser.first_name?.charAt(0).toUpperCase() +
                      currentUser.first_name?.slice(1)
                    } ${
                      currentUser.last_name?.charAt(0).toUpperCase() +
                      currentUser.last_name?.slice(1)
                    }`
                  : 'John Degz'}
              </Typography>
            </Box>

            <TextField
              placeholder="Write something funny..."
              variant="outlined"
              multiline
              rows={3}
              value={caption}
              onChange={(e) => {
                const value = e.target.value;
                const fixedValue = value.replace(/^( +) /, (match) =>
                  '\u00A0'.repeat(match.length)
                );
                setCaption(fixedValue);
              }}
              sx={{
                width: '100%',
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  bgcolor:
                    theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                  borderRadius: 1,
                  '& textarea': {
                    whiteSpace: 'pre-wrap',
                    fontFamily: 'monospace',
                  },
                },
              }}
            />

            {imagePreview && (
              <Box sx={{ mt: 2, mb: 2, textAlign: 'center' }}>
                <img
                  src={imagePreview || '/placeholder.svg'}
                  alt="Preview"
                  style={{
                    maxWidth: '100%',
                    borderRadius: '8px',
                    display: 'block',
                    margin: 'auto',
                  }}
                />
              </Box>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<PhotoCamera />}
                  component="label"
                  sx={{ borderRadius: 4 }}
                >
                  Upload
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setImage(e.target.files[0]);
                        setImagePreview(URL.createObjectURL(e.target.files[0]));
                      }
                    }}
                  />
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setShowMemeCreator(true)}
                  sx={{ borderRadius: 4 }}
                >
                  Create Meme
                </Button>
              </Box>
              <Button
                variant="contained"
                color="primary"
                onClick={handlePost}
                disabled={!caption && !imagePreview}
                sx={{
                  borderRadius: 4,
                  bgcolor: '#8a4fff',
                  '&:hover': {
                    bgcolor: '#7a3fef',
                  },
                }}
              >
                POST
              </Button>
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default CreatePostCard;
