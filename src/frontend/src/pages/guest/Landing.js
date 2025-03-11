import { faker } from '@faker-js/faker';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Box, Container, Grid, Button as MuiButton, Typography } from '@mui/material';
import ButtonRound from 'components/atoms/ButtonRound';
import Feature from 'components/atoms/Feature';
import HeroImage from 'components/atoms/HeroImage';
import Section from 'components/atoms/Section';
import CallToAction from 'components/molecules/CallToAction';
import ReviewSlider from 'components/molecules/ReviewSlider';
import Seo from 'components/organisms/Seo';

function Landing() {
  const { t } = useTranslation();

  const features = [
    {
      title: t('pages.landing.docker.heading'),
      description: t('pages.landing.docker.description'),
      image: '/static/images/feature_page.png',
      left: true,
    },
    {
      title: t('pages.landing.react.heading'),
      description: t('pages.landing.react.description'),
      image: '/static/images/feature_ranking.png',
      left: false,
    },
    {
      title: t('pages.landing.laravel.heading'),
      description: t('pages.landing.laravel.description'),
      image: '/static/images/feature_voting.png',
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
        title="Sprobe Base Template"
        description="This is a boilerplate for React + Laravel Applications."
        image="http://test.com/"
      />

      <HeroImage image="/static/images/background_memema2.jpg" height="calc(100vh - 100px)">
        <Box
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}
        >
          <Box>
            <Typography
              component="h2"
              variant="h2"
              align="center"
              color="text.primary"
              gutterBottom
              sx={{ fontWeight: 'bold', color: 'white', textShadow: '2px 2px rgba(0, 0, 0, 0.5)' }}
            >
              {t('pages.landing.main_heading')}
            </Typography>
            <Typography
              variant="h5"
              align="center"
              color="text.secondary"
              component="p"
              sx={{ color: 'white' }}
            >
              {t('pages.landing.sub_heading')}
            </Typography>

            <Box textAlign="center" sx={{ mt: 2 }}>
              <ButtonRound component={Link} to="/signup" disableElevation>
                {t('labels.get_started')}
              </ButtonRound>
            </Box>
          </Box>
        </Box>
      </HeroImage>

      {/** Features List */}
      <Section heading={t('pages.landing.why_heading')}>
        {features.map((feature, key) => {
          return (
            <Feature
              key={key}
              title={feature.title}
              description={feature.description}
              image={feature.image}
              left={feature.left}
            />
          );
        })}
      </Section>

      {/** Our Clients */}
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
      </Section>

      {/** Reviews */}
      <Section heading={t('pages.landing.reviews_heading')} fullWidth={true}>
        <ReviewSlider reviews={reviews} sx={{ mt: 6, p: 4 }} />

        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <MuiButton variant="outlined">{t('pages.landing.see_all_reviews')}</MuiButton>
        </Box>
      </Section>

      {/** CTA */}
      <CallToAction />
    </>
  );
}

export default Landing;
