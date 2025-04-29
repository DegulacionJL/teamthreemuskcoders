import PropTypes from 'prop-types';
import { useState } from 'react';
import {
  Check as CheckIcon,
  PersonAdd as PersonAddIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Grid,
  InputAdornment,
  Pagination,
  Paper,
  TextField,
  Typography,
} from '@mui/material';

const UsersCardList = ({
  data,
  page,
  total,
  handleChangePage,
  handleSearch,
  handleFollow,
  loading = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const onSearchChange = (event) => {
    const keyword = event.target.value;
    setSearchQuery(keyword);
    handleSearch(keyword);
  };

  const onPageChange = (event, value) => {
    handleChangePage(event, value);
  };

  return (
    <Box>
      <Paper sx={{ px: 15, borderRadius: 2, mb: 3, bgcolor: '#1a1f2e' }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
          <TextField
            placeholder="Search users"
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={onSearchChange}
            sx={{
              width: { xs: '100%', sm: '300px' },
              '& .MuiOutlinedInput-root': {
                bgcolor: '#252b3b',
                color: '#fff',
                '& fieldset': {
                  borderColor: '#3a4256',
                },
                '&:hover fieldset': {
                  borderColor: '#4a5269',
                },
              },
              '& .MuiInputLabel-root': {
                color: '#8a94a8',
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#8a94a8' }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : data.length > 0 ? (
          <>
            <Grid container spacing={4}>
              {data.map((userData) => {
                // Check if the current user is following this user
                const isFollowing = userData.isFollowing;

                return (
                  <Grid item xs={12} sm={6} md={3} key={userData.id}>
                    <Card
                      sx={{
                        height: '100%',
                        bgcolor: '#252b3b',
                        color: '#fff',
                        border: '1px solid #3a4256',
                      }}
                    >
                      <CardContent sx={{ pb: 4 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar
                            src={
                              userData.avatar ||
                              `/placeholder.svg?height=50&width=50&text=${userData.first_name.charAt(
                                0
                              )}`
                            }
                            sx={{ width: 60, height: 60, mr: 2, bgcolor: '#6366f1' }}
                          />
                          <Box>
                            <Typography
                              variant="subtitle1"
                              fontWeight="medium"
                              sx={{
                                cursor: 'pointer',
                                '&:hover': {
                                  textDecoration: 'underline',
                                  color: '#6366f1',
                                },
                              }}
                              onClick={(e) => {
                                // Prevent default behavior
                                e.preventDefault();
                                e.stopPropagation();
                                // Navigate to user profile
                                window.location.href = `/users/${userData.id}`;
                              }}
                            >
                              {userData.first_name} {userData.last_name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Status: {userData.status?.name || 'Unknown'}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                      <CardActions>
                        <Button
                          fullWidth
                          variant={isFollowing ? 'outlined' : 'contained'}
                          size="small"
                          startIcon={isFollowing ? <CheckIcon /> : <PersonAddIcon />}
                          onClick={() => handleFollow(userData.id)}
                          sx={{
                            bgcolor: isFollowing ? 'transparent' : '#6366f1',
                            borderColor: '#6366f1',
                            color: isFollowing ? '#6366f1' : '#fff',
                            '&:hover': {
                              bgcolor: isFollowing ? 'rgba(99, 102, 241, 0.1)' : '#5254cc',
                              borderColor: '#5254cc',
                            },
                          }}
                        >
                          {isFollowing ? 'Following' : 'Follow'}
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>

            {total > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Pagination
                  count={total}
                  page={page}
                  onChange={onPageChange}
                  color="primary"
                  sx={{
                    '& .MuiPaginationItem-root': {
                      color: '#fff',
                    },
                    '& .Mui-selected': {
                      bgcolor: '#6366f1 !important',
                    },
                  }}
                />
              </Box>
            )}
          </>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              No users found
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

UsersCardList.propTypes = {
  data: PropTypes.array.isRequired,
  page: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  handleChangePage: PropTypes.func.isRequired,
  handleSearch: PropTypes.func.isRequired,
  handleFollow: PropTypes.func.isRequired,
  user: PropTypes.object,
  loading: PropTypes.bool.isRequired,
};

export default UsersCardList;
