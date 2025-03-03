import { useTranslation } from 'react-i18next';
import { Box, Container, Grid, Typography } from '@mui/material';
import { blueGrey } from '@mui/material/colors';
import List from 'components/molecules/List';

function Footer() {
  const currentYear = new Date().getFullYear();
  const { t } = useTranslation();

  const navigation = [
    { label: t('menu.privacy_policy'), url: '/privacy-policy' },
    { label: t('menu.faq'), url: '/faq' },
    { label: t('menu.terms'), url: '/terms' },
  ];

  const resources = [
    { label: t('menu.styleguide'), url: '/styleguide' },
    { label: t('menu.api_reference'), url: '/#' },
    { label: t('menu.support'), url: '/#' },
  ];

  return (
    <Box sx={{ py: 8, color: blueGrey['A100'], backgroundColor: blueGrey[900] }} component="footer">
      <Container>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Box sx={{ mb: 2 }}>
              <img src="" alt={process.env.REACT_APP_SITE_TITLE} width="100" />
            </Box>
            <Typography variant="body2" component="span">
              &copy; {currentYear} {process.env.REACT_APP_SITE_TITLE}.
            </Typography>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Typography
              variant="body2"
              component="h5"
              sx={{ fontWeight: 600, textTransform: 'uppercase' }}
            >
              {t('labels.navigation')}
            </Typography>

            <List items={navigation} />
          </Grid>

          <Grid item xs={12} sm={4}>
            <Typography
              variant="body2"
              component="h5"
              sx={{ fontWeight: 600, textTransform: 'uppercase' }}
            >
              {t('labels.resources')}
            </Typography>

            <List items={resources} variant="body2" />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Footer;
