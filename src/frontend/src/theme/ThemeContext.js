import PropTypes from 'prop-types';
import { createContext, useContext, useEffect, useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider as MUIThemeProvider, createTheme } from '@mui/material/styles';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : true;
  });

  // Create the MUI theme based on dark mode state
  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#8a4fff',
        light: '#b07fff',
        dark: '#6a3fd0',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#ffb300',
        light: '#ffe54c',
        dark: '#c68400',
        contrastText: '#000000',
      },
      background: {
        default: darkMode ? '#121824' : '#F9FAFB',
        paper: darkMode ? '#1a2235' : '#FFFFFF', // Slightly lighter navy for cards
      },
      text: {
        primary: darkMode ? '#FFFFFF' : '#333333',
        secondary: darkMode ? '#AAAAAA' : '#666666',
      },
      action: {
        active: darkMode ? '#8a4fff' : '#6a3fd0',
        hover: darkMode ? 'rgba(138, 79, 255, 0.08)' : 'rgba(106, 63, 208, 0.08)',
      },
      divider: darkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h6: {
        fontWeight: 600,
      },
      subtitle1: {
        fontWeight: 600,
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: darkMode
              ? '0 4px 20px rgba(0,0,0,0.5)'
              : '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
            overflow: 'hidden',
          },
        },
      },
      MuiCardHeader: {
        styleOverrides: {
          root: {
            backgroundColor: darkMode ? '#4a3b6b' : '#f0f0f0', // Purple header background
            color: '#ffffff',
            padding: '12px 16px',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            fontWeight: 500,
          },
          colorPrimary: {
            backgroundColor: darkMode ? '#4a3b6b' : '#e0e0ff',
            color: darkMode ? '#ffffff' : '#4a3b6b',
            '&:hover': {
              backgroundColor: darkMode ? '#5a4b7b' : '#d0d0ff',
            },
          },
          colorSecondary: {
            backgroundColor: darkMode ? '#5d4037' : '#ffe0b2',
            color: darkMode ? '#ffffff' : '#5d4037',
          },
          colorSuccess: {
            backgroundColor: darkMode ? '#2e7d32' : '#e8f5e9',
            color: darkMode ? '#ffffff' : '#2e7d32',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: 'none',
            fontWeight: 600,
          },
          containedPrimary: {
            backgroundColor: '#8a4fff',
            '&:hover': {
              backgroundColor: '#7a3fef',
            },
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            '&.Mui-selected': {
              backgroundColor: darkMode ? 'rgba(138, 79, 255, 0.16)' : 'rgba(138, 79, 255, 0.08)',
              '&:hover': {
                backgroundColor: darkMode ? 'rgba(138, 79, 255, 0.24)' : 'rgba(138, 79, 255, 0.16)',
              },
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
              backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiAvatar: {
        styleOverrides: {
          root: {
            backgroundColor: darkMode ? '#4a3b6b' : '#e0e0ff',
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600,
          },
        },
      },
    },
  });

  // Toggle dark mode function
  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  // Update body class and localStorage when dark mode changes
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      <MUIThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MUIThemeProvider>
    </ThemeContext.Provider>
  );
};

// Add prop-types validation for children
ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
