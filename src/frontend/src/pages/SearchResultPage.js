import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchPostsByHashtag, fetchPostsByKeyword } from 'services/meme.service';
import { unifiedSearch } from 'services/search.service';
import VerifiedIcon from '@mui/icons-material/CheckCircle';
// Material UI imports
import SearchIcon from '@mui/icons-material/Search';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import InputBase from '@mui/material/InputBase';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import { useTheme } from 'theme/ThemeContext';

function SearchResultsPage() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const keyword = query.get('keyword') || '';
  const [searchTerm, setSearchTerm] = useState(keyword);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const user = useSelector((state) => state.profile.user);

  const { darkMode } = useTheme(); // Access the darkMode state

  // Default search query parameters
  const defaultQuery = {
    limit: 20,
    page: 1,
    keyword: '',
  };

  // Search type mapping for tabs
  const searchTypes = [
    ['user', 'post', 'hashtag'], // All
    ['user'], // Users
    ['post'], // Posts
    ['hashtag'], // Hashtags
  ];

  useEffect(() => {
    if (keyword) {
      setSearchTerm(keyword);
      performSearch(keyword, activeTab);

      // Save to recent searches
      try {
        const saved = localStorage.getItem('recent_searches') || '[]';
        const searches = JSON.parse(saved);
        const updatedSearches = [keyword, ...searches.filter((item) => item !== keyword)].slice(
          0,
          5
        );
        localStorage.setItem('recent_searches', JSON.stringify(updatedSearches));
      } catch (error) {
        console.warn('Failed to save recent search', error);
      }
    }
  }, [keyword, activeTab]);

  const performSearch = async (term, tabIndex) => {
    if (!term.trim()) return;

    setIsLoading(true);

    try {
      let resultsData = [];
      if (tabIndex === 1) {
        // Users tab
        const query = {
          ...defaultQuery,
          keyword: term,
          userId: user?.id,
        };
        resultsData = await unifiedSearch(query, searchTypes[tabIndex]);
      } else if (tabIndex === 2) {
        // Posts tab
        resultsData = await fetchPostsByKeyword(term);
      } else if (tabIndex === 3) {
        // Hashtags tab
        try {
          resultsData = await fetchPostsByHashtag(term);
          setResults(resultsData.data || []);
        } catch (error) {
          console.error('Error fetching hashtags:', error);
          setResults([]);
        }
      } else {
        // All tab
        const query = {
          ...defaultQuery,
          keyword: term,
          userId: user?.id,
        };
        resultsData = await unifiedSearch(query, searchTypes[tabIndex]);
      }
      if (tabIndex !== 3) {
        setResults(resultsData.data || []);
      }
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      navigate(`/search-results?keyword=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleTabChange = (tabIndex) => {
    console.log('Switching to tab: ', tabIndex);
    setActiveTab(tabIndex);
    performSearch(searchTerm, tabIndex);
  };

  const handleResultClick = (result) => {
    if (result.type === 'user') {
      navigate(`/users/${result.id}`);
    } else if (result.type === 'post') {
      navigate(`/posts/${result.id}`);
    } else if (result.type === 'hashtag') {
      navigate(`/hashtagpage/${result.name || result.tag}`);
    }
  };

  // Render helper for result counts
  const renderResultCount = (result) => {
    if (result.type === 'user') {
      return result.followers ? `${result.followers} followers` : null;
    } else if (result.type === 'post') {
      return result.date ? result.date : null;
    } else if (result.type === 'hashtag') {
      return result.count ? `${result.count} posts` : null;
    }
    return null;
  };

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100vh',
        bgcolor: darkMode ? 'background.default' : '#F0F2F5', // Adjust background color
      }}
    >
      {/* Left sidebar for filters - Facebook style */}
      <Box
        sx={{
          width: 220,
          flexShrink: 0,
          borderRight: '1px solid',
          borderColor: 'divider',
          bgcolor: darkMode ? 'background.paper' : 'background.default', // Adjust based on dark mode
          height: '100%',
          position: 'sticky',
          top: 0,
          p: 2,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            mb: 2,
            fontWeight: 'bold',
            color: darkMode ? 'text.primary' : 'text.secondary', // Adjust text color
          }}
        >
          {t('search.resultsFor')}
          <br />
          <Typography
            component="span"
            sx={{
              color: darkMode ? 'text.secondary' : 'text.disabled', // Adjust text color
              fontSize: '0.9rem',
            }}
          >
            {keyword}
          </Typography>
        </Typography>

        <Typography
          variant="subtitle1"
          sx={{
            mb: 1,
            mt: 3,
            fontWeight: 'bold',
            color: darkMode ? 'text.primary' : 'text.secondary', // Adjust text color
          }}
        >
          {t('search.filters')}
        </Typography>

        <List disablePadding>
          {['All', 'Users', 'Posts', 'Hashtags'].map((filter, index) => (
            <ListItemButton
              key={filter}
              dense
              onClick={() => handleTabChange(index)}
              selected={activeTab === index}
              sx={{
                borderRadius: 1,
                mb: 0.5,
                '&.Mui-selected': {
                  bgcolor: alpha(darkMode ? '#1877F2' : '#E3F2FD', 0.1),
                  '&:hover': {
                    bgcolor: alpha(darkMode ? '#1877F2' : '#E3F2FD', 0.2),
                  },
                },
                '&:hover': {
                  bgcolor: alpha(darkMode ? '#1877F2' : '#E3F2FD', 0.05),
                },
              }}
            >
              <ListItemText
                primary={filter}
                primaryTypographyProps={{
                  sx: {
                    fontWeight: activeTab === index ? 'bold' : 'normal',
                    color: activeTab === index ? '#1877F2' : 'inherit',
                  },
                }}
              />
            </ListItemButton>
          ))}
        </List>
      </Box>

      {/* Main content area */}
      <Box sx={{ flexGrow: 1, p: 3, bgcolor: darkMode ? 'background.default' : '#F0F2F5' }}>
        {/* Search input field */}
        <Paper
          elevation={0}
          sx={{
            p: '2px 4px',
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            mb: 3,
            borderRadius: '50px',
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: darkMode ? 'background.paper' : 'background.default', // Adjust background color
          }}
        >
          <Box
            sx={{
              padding: '0 16px',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              color: darkMode ? 'text.secondary' : 'text.primary', // Adjust icon color
            }}
          >
            {isLoading ? <CircularProgress size={20} /> : <SearchIcon />}
          </Box>
          <InputBase
            sx={{
              ml: 1,
              flex: 1,
              py: 1,
              color: darkMode ? 'text.primary' : 'text.secondary', // Adjust text color
            }}
            placeholder={t('labels.search')}
            value={searchTerm}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            inputProps={{ 'aria-label': t('labels.search') }}
          />
        </Paper>

        {/* Tab navigation */}
        <Box
          sx={{
            display: 'flex',
            mb: 3,
            borderBottom: '1px solid',
            borderColor: 'divider',
            bgcolor: darkMode ? 'background.paper' : 'background.default', // Adjust background color
            borderRadius: '8px 8px 0 0',
          }}
        >
          {['All', 'Users', 'Posts', 'Hashtags'].map((tab, index) => (
            <Box
              key={tab}
              onClick={() => handleTabChange(index)}
              sx={{
                py: 1.5,
                px: 3,
                cursor: 'pointer',
                color:
                  activeTab === index ? '#1877F2' : darkMode ? 'text.secondary' : 'text.disabled',
                fontWeight: activeTab === index ? 'bold' : 'normal',
                borderBottom: activeTab === index ? '3px solid #1877F2' : 'none',
                '&:hover': {
                  bgcolor: alpha(darkMode ? '#1877F2' : '#E3F2FD', 0.05),
                },
                transition: 'all 0.2s',
              }}
            >
              {t(`search.${tab.toLowerCase()}`)}
            </Box>
          ))}
        </Box>

        {/* Search results */}
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress sx={{ color: '#1877F2' }} />
          </Box>
        ) : (
          <>
            {results.length > 0 ? (
              <Paper
                elevation={0}
                sx={{
                  borderRadius: 2,
                  overflow: 'hidden',
                  bgcolor: darkMode ? 'background.paper' : 'background.default', // Adjust background color
                }}
              >
                {results.map((result, index) => (
                  <Box key={`${result.type}-${result.id || index}`}>
                    <ListItemButton
                      onClick={() => handleResultClick(result)}
                      sx={{
                        py: 2,
                        px: 3,
                        '&:hover': {
                          bgcolor: alpha(darkMode ? '#1877F2' : '#E3F2FD', 0.05),
                        },
                      }}
                    >
                      {/* User result */}
                      {result.type === 'user' && (
                        <Box
                          sx={{
                            display: 'flex',
                            width: '100%',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar
                              src={result.avatar}
                              alt={`${result.first_name} ${result.last_name}`}
                              sx={{
                                width: 56,
                                height: 56,
                                mr: 3,
                                bgcolor: darkMode ? '#4a3b6b' : '#E4E6EB', // Adjust avatar background
                              }}
                            />
                            <Box>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography
                                  variant="subtitle1"
                                  sx={{
                                    fontWeight: 'bold',
                                    color: darkMode ? 'text.primary' : 'text.secondary', // Adjust text color
                                  }}
                                >
                                  {`${result.first_name} ${result.last_name}`}
                                </Typography>
                                {result.verified && (
                                  <VerifiedIcon
                                    sx={{ ml: 0.5, color: '#1877F2', fontSize: '0.9rem' }}
                                  />
                                )}
                              </Box>
                              <Typography
                                variant="body2"
                                sx={{
                                  color: darkMode ? 'text.secondary' : 'text.disabled',
                                  mt: 0.5,
                                }} // Adjust text color
                              ></Typography>
                            </Box>
                          </Box>
                          {/* Add View Profile button on the right */}
                          <Box>
                            <Typography
                              variant="body2"
                              component="a"
                              href={`/users/${result.id}`}
                              sx={{
                                color: '#1877F2',
                                textDecoration: 'none',
                                mr: 3,
                                fontWeight: 'bold',
                                '&:hover': {
                                  textDecoration: 'underline',
                                },
                              }}
                            >
                              View Profile
                            </Typography>
                          </Box>
                        </Box>
                      )}

                      {/* Post result */}
                      {result.type === 'post' && (
                        <Box sx={{ display: 'flex', width: '100%' }}>
                          {result.authorAvatar && (
                            <Avatar
                              src={result.authorAvatar}
                              alt={result.author || ''}
                              sx={{
                                width: 40,
                                height: 40,
                                mr: 2,
                                bgcolor: darkMode ? '#4a3b6b' : '#E4E6EB', // Adjust avatar background
                              }}
                            />
                          )}
                          <Box sx={{ flexGrow: 1 }}>
                            {result.author && (
                              <Typography
                                variant="subtitle2"
                                sx={{
                                  fontWeight: 'bold',
                                  mb: 0.5,
                                  color: darkMode ? 'text.primary' : 'text.secondary', // Adjust text color
                                }}
                              >
                                {result.author}
                              </Typography>
                            )}
                            <Typography
                              variant="body1"
                              sx={{ mb: 1, color: darkMode ? 'text.primary' : 'text.secondary' }} // Adjust text color
                            >
                              {result.content}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ color: darkMode ? 'text.secondary' : 'text.disabled' }} // Adjust text color
                            >
                              {renderResultCount(result)}
                            </Typography>
                          </Box>
                        </Box>
                      )}

                      {/* Hashtag result */}
                      {result.type === 'hashtag' && (
                        <Box sx={{ display: 'flex', width: '100%', alignItems: 'center' }}>
                          <Box
                            sx={{
                              width: 56,
                              height: 56,
                              mr: 2,
                              borderRadius: '50%',
                              bgcolor: darkMode ? '#4a3b6b' : '#E4E6EB', // Adjust background
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: darkMode ? '#ffffff' : '#65676B', // Adjust text color
                              fontWeight: 'bold',
                              fontSize: '1.2rem',
                            }}
                          >
                            #
                          </Box>
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography
                              variant="subtitle1"
                              sx={{
                                fontWeight: 'bold',
                                color: darkMode ? 'text.primary' : 'text.secondary', // Adjust text color
                              }}
                            >
                              #{result.name || result.tag}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ color: darkMode ? 'text.secondary' : 'text.disabled' }} // Adjust text color
                            >
                              {result.count ? `${result.count} posts` : null}
                            </Typography>
                          </Box>
                        </Box>
                      )}
                    </ListItemButton>
                    {index < results.length - 1 && <Divider />}
                  </Box>
                ))}
              </Paper>
            ) : (
              <Paper
                elevation={0}
                sx={{
                  textAlign: 'center',
                  mt: 4,
                  p: 4,
                  borderRadius: 2,
                  bgcolor: darkMode ? 'background.paper' : 'background.default', // Adjust background color
                }}
              >
                <Typography
                  variant="body1"
                  sx={{ color: darkMode ? 'text.secondary' : 'text.disabled' }} // Adjust text color
                >
                  {t('search.noResults')} "{keyword}"
                </Typography>
              </Paper>
            )}
          </>
        )}
      </Box>
    </Box>
  );
}

export default SearchResultsPage;
