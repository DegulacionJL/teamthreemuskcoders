import palette from 'theme/palette';

const getTheme = (darkMode) => {
  return darkMode ? palette.darkPalette : palette.lightPalette;
};

export default getTheme;
