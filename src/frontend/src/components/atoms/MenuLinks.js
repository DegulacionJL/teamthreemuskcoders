import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
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
    position: 'relative',
    transition: 'all 0.3s ease',
    '&:hover': {
      color: '#ffb300', // Using the same yellow as your app name for consistency
      transform: 'translateY(-2px)', // Slight upward movement for playfulness
      textShadow: '0 0 5px rgba(255, 255, 255, 0.5)', // Subtle glow effect
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      width: '0%',
      height: '2px',
      bottom: '0',
      left: '50%',
      background: '#ffb300',
      transition: 'all 0.3s ease',
      transform: 'translateX(-50%)',
    },
    '&:hover::after': {
      width: '80%', // Expands on hover
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

// MenuLinks.defaultProps = {
//   items: [],
// };

export default MenuLinks;
