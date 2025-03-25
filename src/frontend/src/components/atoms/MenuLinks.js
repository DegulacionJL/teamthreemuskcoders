import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import theme from 'theme';
import Box from '@mui/material/Box';

function MenuLinks(props) {
  const { items } = props;

  const ulStyles = {
    display: 'flex',
    p: 0,
    listStyleType: 'none',
    my: '8px',
    alignItems: 'center',
  };

  const linkStyles = {
    textDecoration: 'none',
    color: 'white',
    textTransform: 'uppercase',
    padding: '6px 16px',
    letterSpacing: 1,
    '&:hover': {
      color: theme.palette.primary.main,
    },
  };

  return (
    <Box component="ul" sx={ulStyles}>
      {items.map((item, key) => (
        <Box component="li" key={key}>
          <Box component={Link} to={item.url} sx={linkStyles}>
            {item.label}
          </Box>
        </Box>
      ))}
    </Box>
  );
}

MenuLinks.propTypes = {
  items: PropTypes.array.isRequired,
};

MenuLinks.defaultProps = {
  items: [],
};

export default MenuLinks;
