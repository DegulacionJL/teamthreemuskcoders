import PropTypes from 'prop-types';
import { useState } from 'react';
import {
  Add as AddIcon,
  Cake as CakeIcon,
  Edit as EditIcon,
  Favorite as FavoriteIcon,
  Language as LanguageIcon,
  LocationOn as LocationIcon,
  School as SchoolIcon,
  Work as WorkIcon,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from '@mui/material';

const AboutSection = ({ profile, isCurrentUser }) => {
  const [editMode, setEditMode] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    work: profile?.work || '',
    education: profile?.education || '',
    location: profile?.location || '',
    birthday: profile?.birthday || '',
    website: profile?.website || '',
    relationship: profile?.relationship || '',
    bio: profile?.bio || '',
  });

  const handleEditToggle = () => {
    setEditMode(!editMode);
    if (!editMode) {
      setEditedProfile({
        work: profile?.work || '',
        education: profile?.education || '',
        location: profile?.location || '',
        birthday: profile?.birthday || '',
        website: profile?.website || '',
        relationship: profile?.relationship || '',
        bio: profile?.bio || '',
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile({
      ...editedProfile,
      [name]: value,
    });
  };

  const handleSave = () => {
    // Call API to save profile changes
    console.log('Saving profile:', editedProfile);
    setEditMode(false);
    // Update profile state in parent component
  };

  return (
    <Box>
      <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" fontWeight="bold">
            About
          </Typography>
          {isCurrentUser && (
            <Button
              startIcon={editMode ? null : <EditIcon />}
              onClick={handleEditToggle}
              variant={editMode ? 'outlined' : 'text'}
              size="small"
            >
              {editMode ? 'Cancel' : 'Edit'}
            </Button>
          )}
        </Box>

        {editMode ? (
          <Box component="form">
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Bio"
                  name="bio"
                  value={editedProfile.bio}
                  onChange={handleInputChange}
                  multiline
                  rows={3}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Work"
                  name="work"
                  value={editedProfile.work}
                  onChange={handleInputChange}
                  InputProps={{
                    startAdornment: <WorkIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Education"
                  name="education"
                  value={editedProfile.education}
                  onChange={handleInputChange}
                  InputProps={{
                    startAdornment: <SchoolIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Location"
                  name="location"
                  value={editedProfile.location}
                  onChange={handleInputChange}
                  InputProps={{
                    startAdornment: <LocationIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Birthday"
                  name="birthday"
                  value={editedProfile.birthday}
                  onChange={handleInputChange}
                  InputProps={{
                    startAdornment: <CakeIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Website"
                  name="website"
                  value={editedProfile.website}
                  onChange={handleInputChange}
                  InputProps={{
                    startAdornment: <LanguageIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Relationship Status"
                  name="relationship"
                  value={editedProfile.relationship}
                  onChange={handleInputChange}
                  InputProps={{
                    startAdornment: <FavoriteIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <Button variant="contained" onClick={handleSave}>
                    Save Changes
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        ) : (
          <Box>
            {profile?.bio ? (
              <Typography variant="body1" paragraph>
                {profile.bio}
              </Typography>
            ) : (
              <Typography variant="body2" color="text.secondary" paragraph>
                No bio added yet.
                {isCurrentUser && ' Add a bio to tell people more about yourself.'}
              </Typography>
            )}

            <List sx={{ py: 0 }}>
              {profile?.work && (
                <ListItem sx={{ px: 0, py: 1 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <WorkIcon color="action" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Work"
                    secondary={profile.work}
                    primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                    secondaryTypographyProps={{ variant: 'body1' }}
                  />
                </ListItem>
              )}

              {profile?.education && (
                <ListItem sx={{ px: 0, py: 1 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <SchoolIcon color="action" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Education"
                    secondary={profile.education}
                    primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                    secondaryTypographyProps={{ variant: 'body1' }}
                  />
                </ListItem>
              )}

              {profile?.location && (
                <ListItem sx={{ px: 0, py: 1 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <LocationIcon color="action" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Location"
                    secondary={profile.location}
                    primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                    secondaryTypographyProps={{ variant: 'body1' }}
                  />
                </ListItem>
              )}

              {profile?.birthday && (
                <ListItem sx={{ px: 0, py: 1 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <CakeIcon color="action" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Birthday"
                    secondary={profile.birthday}
                    primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                    secondaryTypographyProps={{ variant: 'body1' }}
                  />
                </ListItem>
              )}

              {profile?.website && (
                <ListItem sx={{ px: 0, py: 1 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <LanguageIcon color="action" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Website"
                    secondary={profile.website}
                    primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                    secondaryTypographyProps={{ variant: 'body1' }}
                  />
                </ListItem>
              )}

              {profile?.relationship && (
                <ListItem sx={{ px: 0, py: 1 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <FavoriteIcon color="action" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Relationship Status"
                    secondary={profile.relationship}
                    primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                    secondaryTypographyProps={{ variant: 'body1' }}
                  />
                </ListItem>
              )}
            </List>

            {isCurrentUser &&
              !profile?.work &&
              !profile?.education &&
              !profile?.location &&
              !profile?.birthday &&
              !profile?.website &&
              !profile?.relationship && (
                <Button
                  startIcon={<AddIcon />}
                  variant="outlined"
                  onClick={handleEditToggle}
                  sx={{ mt: 2 }}
                >
                  Add Profile Details
                </Button>
              )}
          </Box>
        )}
      </Paper>
    </Box>
  );
};

AboutSection.propTypes = {
  profile: PropTypes.shape({
    work: PropTypes.string,
    education: PropTypes.string,
    location: PropTypes.string,
    birthday: PropTypes.string,
    website: PropTypes.string,
    relationship: PropTypes.string,
    bio: PropTypes.string,
  }),
  isCurrentUser: PropTypes.bool,
};

export default AboutSection;
