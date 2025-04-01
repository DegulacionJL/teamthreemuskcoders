import PropTypes from 'prop-types';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import Button from 'components/atoms/Button';

function TableToolbar(props) {
  const { handleSearch, handleAdd } = props;
  const { t } = useTranslation();
  const searchEl = useRef(null);
  const [submitted, setSubmitted] = useState(false);

  const handleClear = () => {
    setSubmitted(false);
    // reset search keyword value
    searchEl.current.value = '';
    handleSearch('');
  };

  const handleClick = () => {
    if (!searchEl.current.value) return;
    // trigger only if user typed in something
    setSubmitted(true);
    handleSearch(searchEl.current.value);
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, width: '100%' }}>
      <Box
        sx={(theme) => ({
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          maxWidth: 300,
          background: '#fff',
          borderRadius: theme.spacing(0.5),
          border: `1px solid ${theme.palette.grey[400]}`,
        })}
      >
        <InputBase
          inputRef={searchEl}
          placeholder={t('labels.enter_keyword')}
          startAdornment={<SearchIcon sx={{ color: '#555', mr: 1, fontSize: 22 }} />}
          sx={{
            width: '100%',
            maxWidth: '320px',
            height: '42px',
            pl: 2,
            pr: 2,
            borderRadius: '8px',
            backgroundColor: '#f1f5f9', // Light gray background
            transition: '0.2s ease-in-out',
            '&:hover': {
              backgroundColor: '#e2e8f0', // Slightly darker gray on hover
            },
            '& .MuiInputBase-input': {
              fontSize: '15px',
              fontWeight: 400,
              color: '#333',
            },
          }}
        />

        <Box>
          {submitted && (
            <IconButton onClick={() => handleClear()}>
              <ClearIcon color="error" />
            </IconButton>
          )}
          <IconButton onClick={() => handleClick()}>
            <SearchIcon />
          </IconButton>
        </Box>
      </Box>

      <Button
        onClick={() => handleAdd()}
        startIcon={<AddIcon sx={{ fontSize: 22 }} />}
        sx={{
          backgroundColor: '#1e88e5', // Blue primary color
          color: 'white',
          fontSize: '14px',
          fontWeight: 500,
          textTransform: 'none',
          borderRadius: '8px',
          padding: '8px 16px',
          transition: '0.2s ease-in-out',
          '&:hover': {
            backgroundColor: '#1565c0', // Darker blue on hover
          },
          '&:active': {
            backgroundColor: '#0d47a1', // Even darker blue when clicked
          },
        }}
      >
        {t('labels.add_new')}
      </Button>
    </Box>
  );
}

TableToolbar.propTypes = {
  handleSearch: PropTypes.func,
  handleAdd: PropTypes.func,
};

export default TableToolbar;
