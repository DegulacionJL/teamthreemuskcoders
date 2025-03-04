import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import ButtonRound from 'components/atoms/ButtonRound';
import Heading from 'components/atoms/Heading';

function CallToAction() {
  const { t } = useTranslation();

  return (
    <Box sx={(theme) => ({ display: 'flex', mb: -8, background: theme.palette.secondary.memema_cta })}>
      <Container>
        <Grid container spacing={4} sx={{ width: '100%', alignItems: 'center', py: 6 }}>
          <Grid item xs={12} md={8}>
            <Heading variant="h4" sx={{ mb: 0, color: 'white' }}>
              {t('pages.landing.call_to_action')}
            </Heading>
          </Grid>
          <Grid item xs={12} md={4} justify="center">
            <ButtonRound align="center" sx={{ display: 'block', m: '0 auto' }}>
              Join the community
            </ButtonRound>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default CallToAction;
