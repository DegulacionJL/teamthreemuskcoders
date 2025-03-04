import { faker } from '@faker-js/faker';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Box, Container, Grid, Button as MuiButton, Typography } from '@mui/material';
import ButtonRound from 'components/atoms/ButtonRound';
import Section from 'components/atoms/Section';
import CallToAction from 'components/molecules/CallToAction';
import Seo from 'components/organisms/Seo';

function Landing() {
  const { t } = useTranslation();

  const features = [
    {
      title: t('pages.landing.uploads.heading'),
      description: t('pages.landing.uploads.description'),
      image: '/static/images/docker.png',
      left: true, 
    },
    {
      title: t('pages.landing.voting.heading'),
      description: t('pages.landing.voting.description'),
      image: '/static/images/react.png',
      left: false,
    },
    {
      title: t('pages.landing.comment.heading'),
      description: t('pages.landing.comment.description'),
      image: '/static/images/laravel.png',
      left: true,
    },
  ];

  {
    /** dummy client data */
  }
  const clients = [...Array(6)].map((item, index) => {
    index++;
    return {
      name: `Client ${index}`,
      logo: `/static/images/client-logo-${index}.png`,
    };
  });

  {
    /** dummy reviews data */
  }
  const reviews = [...Array(9)].map(() => ({
    avatar: faker.image.people(120, 120, true),
    name: `${faker.name.firstName()} ${faker.name.lastName()}`,
    comment: faker.lorem.words(15),
    rating: Math.random() * (5 - 1) + 1,
  }));

  return (
    <>
      <Seo
        title="MemeMa - MemeSharing Platform"
        description="This is a boilerplate for React + Laravel Applications."
        image="http://test.com/"
      />

      <Box sx={{ backgroundColor: '#171E31', py: 4 }}>
        <Container>
          <Grid 
          container spacing={2} 
          alignItems="center" 
          justifyContent="center" 
          style={{ height: '100vh' }}>
            <Grid item xs={12} md={6}>
              <Typography
                component="h3"
                variant="h3"
                align="left"
                color="text.primary"
                gutterBottom
                sx={{ fontWeight: 'bold', color: 'white', textShadow: '2px 2px rgba(0, 0, 0, 0.5)' }}
              >
                {t('pages.memema.main_heading')}
              </Typography>
              <Typography
                variant="subtitle1"
                align="left"
                color="text.secondary"
                component="p"
                sx={{ color: 'white' }}
              >
                {t('pages.landing.sub_memema_heading')}
              </Typography>

              <Box textAlign="left" sx={{ mt: 2 }}>
                <ButtonRound component={Link} to="/signup" disableElevation>
                  {t('labels.get_started_memema')}
                </ButtonRound>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ position: 'relative', width: '80%', maxWidth: '400px', ml: '90px' }}>
                <Box
                  component="img"
                  alt="Hero Image"
                  src="/static/images/monalisa_bean.jpg"
                  sx={{ width: '100%', height: 'auto', borderRadius: '16px' }}
                />
                <Box
                  component="img"
                  alt="Hero GIF"
                  src="/static/images/laughing.gif"
                  sx={{ position: 'absolute', top:'70%', bottom: '10%', left: '80%', right: '10%', width: '40%', height: 'auto', borderRadius: '16px', transform: 'rotate(-15deg)' }}
                />
                <Box
                  component="img"
                  alt="Hero GIF"
                  src="/static/images/laughingtwo.gif"
                  sx={{ position: 'absolute', top: '40%', left: '-30%', width: '55%', height: 'auto', borderRadius: '16px', transform: 'rotate(25deg)' }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/** Features List */}
      <Section heading={t('pages.landing.why_memema_heading')}>
  <Grid container spacing={4} justifyContent="center">
    {features.map((feature, key) => (
      <Grid item xs={12} sm={4} key={key}>
        <Box textAlign="center">
          <Box
            component="img"
            src={feature.image}
            alt={feature.title}
            sx={{
              width: '100%',
              maxWidth: '180px',
              height: 'auto',
              marginBottom: 2,
            }}
          />
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {feature.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {feature.description}
          </Typography>
        </Box>
      </Grid>
    ))}
  </Grid>
</Section>


      {/* * Our Clients
      <Section heading={t('pages.landing.our_customers_heading')} background="white">
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Grid container spacing={8}>
            {clients.map((client, key) => (
              <Grid item xs={12} sm={4} md={2} key={key}>
                <Box
                  component="img"
                  alt={client.name}
                  src={client.logo}
                  sx={{ width: '100%', m: '0 auto' }}
                />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Section> */}

      {/* * Reviews
      <Section heading={t('pages.landing.reviews_heading')} fullWidth={true}>
        <ReviewSlider reviews={reviews} sx={{ mt: 6, p: 4 }} />

        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <MuiButton variant="outlined">{t('pages.landing.see_all_reviews')}</MuiButton>
        </Box>
      </Section> */}

      {/** CTA */}
      <CallToAction />
    </>
    
  );
}

export default Landing;