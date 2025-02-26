import { faker } from '@faker-js/faker';
import { useTranslation } from 'react-i18next';
import { Box, Container, Grid, Typography } from '@mui/material';
import BodyText from 'components/atoms/BodyText';
import HeroImage from 'components/atoms/HeroImage';
import PageTitle from 'components/atoms/PageTitle';
import Youtube from 'components/atoms/Youtube';
import MemberList from 'components/molecules/MemberList';
import QuiltedImageList from 'components/molecules/QuiltedImageList';

function MemeFeed() {
  const { t } = useTranslation();

  const members = [...Array(6)].map(() => ({
    name: `${faker.name.firstName()} ${faker.name.lastName()}`,
    avatar: faker.image.people(120, 120, true),
    role: faker.name.jobTitle(),
  }));

  const random = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  const images = [...Array(24)].map(() => ({
    alt: faker.lorem.words(3),
    image: faker.image.city(640, 480, true),
    rows: random(1, 2),
    cols: random(1, 2),
  }));

  return (
    <>
      <Container disableGutters component="section" sx={{ pt: 8, pb: 6 }}>
        <PageTitle
          title={t('pages.memefeed.main_heading')}
          subTitle={t('pages.memefeed.sub_heading')}
        />
      </Container>

      {/** Cover */}
      <HeroImage image={faker.image.technics()} height="300px" />

      {/** Staff */}
      <Container disableGutters maxWidth="sm" component="section" sx={{ pt: 12, pb: 6 }}>
        <Typography
          component="h5"
          variant="h5"
          align="center"
          color="text.primary"
          gutterBottom
          sx={{ fontWeight: 'bold', mb: 2 }}
        >
          {t('pages.about.meet_the_team')}
        </Typography>
        <BodyText align="center">{t('pages.about.team_description')}</BodyText>
      </Container>

      <Container maxWidth="lg" sx={{ pb: 12 }}>
        <MemberList members={members} />
      </Container>

      <Box component="section" sx={{ mt: 6, py: 12, backgroundColor: 'white' }}>
        <Container maxWidth="lg">
          <Grid container spacing={8}>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  height: '100%',
                }}
              >
                <Typography
                  component="h5"
                  variant="h5"
                  color="text.primary"
                  sx={{ mb: 4, fontWeight: 'bold' }}
                >
                  {t('pages.about.our_mission')}
                </Typography>
                <BodyText>{t('pages.about.mission_description')}</BodyText>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Youtube videoId="mocuGRf2UVg" />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* * Masonry
      <Container disableGutters maxWidth="sm" component="section" sx={{ pt: 12, pb: 6 }}>
        <Typography
          component="h5"
          variant="h5"
          align="center"
          color="text.primary"
          gutterBottom
          sx={{ fontWeight: 'bold', mb: 2 }}
        >
          {t('pages.about.our_activities')}
        </Typography>
        <BodyText align="center">{t('pages.about.activities_description')}</BodyText>

        <QuiltedImageList images={images} />
      </Container> */}
    </>
  );
}

export default MemeFeed;
