import { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';

const AnimatedMemeCategories = () => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  return (
    <Box
      sx={{
        alignItems: 'start',
        justifyContent: 'start',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
      }}
    >
      {['Popular Memes', 'Trending Now', 'New Arrivals', 'Top Picks'].map((text, index) => (
        <Typography
          key={index}
          variant="h6"
          sx={{
            width: '100%',
            padding: '8px',
            cursor: 'pointer',
            position: 'relative',
            opacity: 0,
            transform: 'translateX(50px)',
            backgroundImage: 'linear-gradient(to right, gray, lightgray, white)',
            transition: `transform 0.5s ease-in-out ${index * 0.2}s, opacity 0.5s ease-in-out ${
              index * 0.2
            }s`,
            ...(animate && { opacity: 1, transform: 'translateX(0)' }),
            ':hover': { color: 'lightgray' },
          }}
        >
          {text}
        </Typography>
      ))}
    </Box>
  );
};

export default AnimatedMemeCategories;
