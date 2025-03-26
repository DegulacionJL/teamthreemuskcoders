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
  const { handleSearch, handleAdd, user } = props;
  const { t } = useTranslation();
  const searchEl = useRef(null);
  const [submitted, setSubmitted] = useState(false);

  console.log('handleAdd value:', handleAdd); // Debugging

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
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2, width: '100%' }}>
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
        <InputBase inputRef={searchEl} placeholder={t('labels.enter_keyword')} sx={{ pl: 1 }} />
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

      {user?.role === 'user' && handleAdd && (
        <Button onClick={handleAdd} startIcon={<AddIcon />}>
          {t('labels.add_new')}
        </Button>
      )}
    </Box>
  );
}
TableToolbar.defaultProps = {
  user: { role: '' }, // Provide a default user object
};

TableToolbar.propTypes = {
  handleSearch: PropTypes.func,
  handleFollow: PropTypes.func,
  handleAdd: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  user: PropTypes.shape({
    role: PropTypes.string.isRequired,
  }).isRequired,
};

export default TableToolbar;
