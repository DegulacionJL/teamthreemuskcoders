import PropTypes from 'prop-types';
import { Box } from '@mui/material';

const AnimatedEmoji = ({ emoji, size = 28, onClick }) => {
  return (
    <Box
      onClick={onClick}
      sx={{
        fontSize: size,
        backgroundColor: 'transparent',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'bounce 0.6s ease infinite alternate',
        cursor: 'pointer',
        transition: 'transform 0.2s',
        '&:hover': { transform: 'scale(1.2)' },
        '@keyframes bounce': {
          '0%': {
            transform: 'translateY(0)',
          },
          '100%': {
            transform: 'translateY(-10px)',
          },
        },

        border: 'none',
        outline: 'none',
        boxShadow: 'none',
        WebkitBackgroundClip: 'text',
        textDecoration: 'none',
      }}
    >
      {emoji}
    </Box>
  );
};

AnimatedEmoji.propTypes = {
  emoji: PropTypes.string.isRequired,
  size: PropTypes.number,
  onClick: PropTypes.func,
};

export default AnimatedEmoji;
