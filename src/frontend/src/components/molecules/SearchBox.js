import PropTypes from 'prop-types';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { unifiedSearch } from 'services/search.service';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

// Utility for debouncing
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    return new Promise((resolve) => {
      timeout = setTimeout(() => resolve(func(...args)), wait);
    });
  };
};

function SearchBox({ onResultSelect, initialTypes = ['user', 'post', 'hashtag'], open, onClose }) {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeTypes, setActiveTypes] = useState(initialTypes);
  const [activeTab, setActiveTab] = useState(0);
  const [recentSearches, setRecentSearches] = useState([]);
  const anchorRef = useRef(null);
  const navigate = useNavigate();
  const user = useSelector((state) => state.profile.user);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Default search query parameters
  const defaultQuery = {
    limit: 20,
    page: 1,
    keyword: '',
  };

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('recent_searches');
      if (saved) {
        setRecentSearches(JSON.parse(saved).slice(0, 5));
      }
    } catch (error) {
      console.warn('Failed to load recent searches', error);
    }
  }, []);

  // Save a search term to recent searches
  const saveToRecentSearches = (term) => {
    if (!term.trim()) return;

    try {
      const updatedSearches = [term, ...recentSearches.filter((item) => item !== term)].slice(0, 5);

      setRecentSearches(updatedSearches);
      localStorage.setItem('recent_searches', JSON.stringify(updatedSearches));
    } catch (error) {
      console.warn('Failed to save recent search', error);
    }
  };

  const performSearch = async (term) => {
    if (!term.trim()) {
      setSearchResults([]);
      setSearchOpen(false);
      return;
    }

    setIsLoading(true);
    setSearchOpen(true);

    saveToRecentSearches(term);

    try {
      const query = {
        ...defaultQuery,
        keyword: term,
        userId: user?.id,
      };

      const results = await unifiedSearch(query, activeTypes);
      setSearchResults(results.data);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
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

  const handleResultClick = (result) => {
    if (onResultSelect) {
      onResultSelect(result);
    }

    if (result.type === 'user') {
      navigate(`/users/${result.id}`);
    } else if (result.type === 'post') {
      navigate(`/posts/${result.id}`);
    } else if (result.type === 'hashtag') {
      navigate(`/hashtag/${result.name || result.tag}`);
    }

    setSearchOpen(false);
    if (onClose) onClose();
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
    setSearchOpen(false);
  };

  const handleRecentSearchClick = (term) => {
    setSearchTerm(term);
    performSearch(term);
  };

  const handleSearchClick = () => {
    if (searchTerm.trim()) {
      navigate(`/search-results?keyword=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    const typeMap = [
      ['user', 'post', 'hashtag'], // All
      ['user'], // Users
      ['post'], // Posts
      ['hashtag'], // Hashtags
    ];
    setActiveTypes(typeMap[newValue]);

    if (searchTerm.trim()) {
      debouncedSearch(searchTerm);
    }
  };

  const debouncedSearch = useCallback(
    debounce((term) => {
      if (term.trim()) {
        performSearch(term);
      } else {
        setSearchResults([]);
        setSearchOpen(false);
      }
    }, 300),
    [activeTypes, user?.id]
  );

  useEffect(() => {
    if (searchTerm.trim()) {
      debouncedSearch(searchTerm);
    } else {
      setSearchResults([]);
      setSearchOpen(false);
    }
  }, [searchTerm, debouncedSearch]);

  const filteredResults =
    activeTab === 0
      ? searchResults
      : searchResults.filter((item) => {
          if (activeTab === 1) return item.type === 'user';
          if (activeTab === 2) return item.type === 'post';
          if (activeTab === 3) return item.type === 'hashtag';
          return true;
        });

  return isMobile ? (
    <Dialog fullScreen open={open} onClose={onClose}>
      <Box sx={{ p: 2 }}>
        <IconButton onClick={onClose} sx={{ mb: 2 }}>
          <CloseIcon />
        </IconButton>
        <InputBase
          placeholder={t('labels.enter_keyword')}
          inputProps={{ 'aria-label': t('labels.enter_keyword') }}
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          sx={{
            width: '100%',
            mb: 2,
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '8px 16px',
          }}
        />
        {isLoading ? (
          <CircularProgress />
        ) : (
          <List>
            {filteredResults.map((result, index) => (
              <ListItem
                key={`${result.type}-${result.id || index}`}
                button
                onClick={() => handleResultClick(result)}
              >
                {result.type === 'user' && (
                  <>
                    <ListItemAvatar>
                      <Avatar src={result.avatar} alt={result.name} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={result.name}
                      secondary={result.username ? `@${result.username}` : null}
                    />
                  </>
                )}
                {result.type === 'post' && (
                  <ListItemText
                    primary={result.content}
                    secondary={result.author ? `by ${result.author}` : null}
                  />
                )}
                {result.type === 'hashtag' && (
                  <ListItemText
                    primary={`#${result.name || result.tag}`}
                    secondary={result.count ? `${result.count} posts` : null}
                  />
                )}
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </Dialog>
  ) : (
    <Box sx={{ position: 'relative', width: '100%' }} ref={anchorRef}>
      <Box
        sx={{
          position: 'relative',
          borderRadius: '50px',
          backgroundColor: (theme) => alpha(theme.palette.common.white, 0.15),
          '&:hover': {
            backgroundColor: (theme) => alpha(theme.palette.common.white, 0.25),
          },
          width: '100%',
          boxShadow: searchOpen ? 3 : 0,
          transition: 'box-shadow 0.2s ease-in-out',
        }}
      >
        {/* <Box
          sx={{
            padding: '0 16px',
            height: '100%',
            position: 'absolute',
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {isLoading ? <CircularProgress size={20} /> : <SearchIcon />}
        </Box> */}
        <InputBase
          placeholder={t('labels.search')}
          inputProps={{ 'aria-label': t('labels.search') }}
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          onFocus={() => {
            if (searchTerm.trim() || recentSearches.length > 0) {
              setSearchOpen(true);
            }
          }}
          sx={{
            color: 'inherit',
            width: '100%',
            '& .MuiInputBase-input': {
              padding: '8px 8px 8px 16px',
              width: searchTerm ? 'calc(100% - 40px)' : '100%',
            },
          }}
        />
        {searchTerm && (
          <IconButton
            size="small"
            aria-label="clear search"
            onClick={handleClearSearch}
            sx={{
              position: 'absolute',
              right: 8,
              top: '50%',
              transform: 'translateY(-50%)',
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        )}
        <IconButton
          size="small"
          aria-label="search"
          onClick={handleSearchClick}
          sx={{
            position: 'absolute',
            right: 40,
            top: '50%',
            transform: 'translateY(-50%)',
          }}
        >
          <SearchIcon fontSize="small" />
        </IconButton>
      </Box>

      <Popper
        open={searchOpen}
        anchorEl={anchorRef.current}
        placement="bottom-start"
        style={{ width: anchorRef.current?.offsetWidth, zIndex: 1200 }}
      >
        <Paper
          elevation={3}
          sx={{
            width: '100%',
            maxHeight: '400px',
            overflowY: 'auto',
            mt: 1,
            p: 0,
          }}
        >
          {searchTerm.trim() ? (
            <>
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                variant="fullWidth"
                aria-label="search result tabs"
              >
                <Tab label={t('search.all')} />
                <Tab label={t('search.users')} />
                <Tab label={t('search.posts')} />
                <Tab label={t('search.hashtags')} />
              </Tabs>
              <List>
                {filteredResults.length > 0 ? (
                  filteredResults.map((result, index) => (
                    <ListItem
                      key={`${result.type}-${result.id || index}`}
                      button
                      onClick={() => handleResultClick(result)}
                    >
                      {result.type === 'user' && (
                        <>
                          <ListItemAvatar>
                            <Avatar src={result.avatar} alt={result.name} />
                          </ListItemAvatar>
                          <ListItemText
                            primary={result.name}
                            secondary={result.username ? `@${result.username}` : null}
                          />
                        </>
                      )}
                      {result.type === 'post' && (
                        <ListItemText
                          primary={result.content}
                          secondary={result.author ? `by ${result.author}` : null}
                        />
                      )}
                      {result.type === 'hashtag' && (
                        <ListItemText
                          primary={`#${result.name || result.tag}`}
                          secondary={result.count ? `${result.count} posts` : null}
                        />
                      )}
                    </ListItem>
                  ))
                ) : (
                  <ListItem>
                    <ListItemText primary={t('search.noResults')} />
                  </ListItem>
                )}
              </List>
            </>
          ) : (
            <>
              <Typography sx={{ p: 2, fontWeight: 'bold' }}>{t('search.recent')}</Typography>
              <List>
                {recentSearches.length > 0 ? (
                  recentSearches.map((term, index) => (
                    <ListItem key={index} button onClick={() => handleRecentSearchClick(term)}>
                      <ListItemText primary={term} />
                    </ListItem>
                  ))
                ) : (
                  <ListItem>
                    <ListItemText primary={t('search.noRecent')} />
                  </ListItem>
                )}
              </List>
            </>
          )}
        </Paper>
      </Popper>
    </Box>
  );
}

SearchBox.propTypes = {
  onResultSelect: PropTypes.func,
  initialTypes: PropTypes.arrayOf(PropTypes.string),
  open: PropTypes.bool,
  onClose: PropTypes.func,
};

SearchBox.defaultProps = {
  onResultSelect: null,
  initialTypes: ['user', 'post', 'hashtag'],
  open: false,
  onClose: null,
};

export default SearchBox;
