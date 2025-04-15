import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { login } from 'services/auth';
import * as yup from 'yup';
import { Box, Card, Container, Grid, Link, useTheme } from '@mui/material';
import Button from 'components/atoms/Button';
import PasswordField from 'components/atoms/Form/PasswordField';
import TextField from 'components/atoms/Form/TextField';
import PageTitle from 'components/atoms/PageTitle';

function Login() {
  const { t } = useTranslation();
  const location = useLocation();
  const user = useSelector((state) => state.profile.user);
  const theme = useTheme(); // Access the current theme

  // form validation
  const schema = yup.object({
    username: yup.string().required(t('form.required')).email(t('form.email')),
    password: yup.string().required(t('form.required')),
  });

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { checkbox: false },
  });

  useEffect(() => {
    if (user) {
      const { role } = user;
      const redirect = role === 'System Admin' ? '/admin/' : '/';
      // use native redirect to avoid UI glitch on state change
      window.location = redirect;
    }
  }, [user]);

  const handleLogin = async (data) => {
    const { username, password } = data;
    await login({ username, password, setError })
      .then(async (user) => {
        const { role } = user;
        let redirect = '';

        switch (role) {
          case 'System Admin':
            redirect = '/admin';
            break;
          default:
            redirect = '/memefeed';
            break;
        }
        const query = new URLSearchParams(location.search);
        // use native redirect to avoid UI glitch on state change
        window.location = query.get('redirect_to') ?? redirect;
      })
      .catch((err) => {
        const { message } = err.response.data;
        toast(message, { type: 'error' });
      });
  };

  return (
    <Container
      maxWidth="xs"
      sx={{
        mt: 8,
        pt: 8,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderRadius: 2,
        padding: 4,
      }}
    >
      <Card
        sx={{
          p: 4,
          backgroundColor:
            theme.palette.mode === 'dark'
              ? 'rgba(26, 34, 53, 0.8)' // Dark mode card background
              : 'rgba(255, 255, 255, 0.8)', // Light mode card background
          color: theme.palette.text.primary, // Dynamic text color
        }}
      >
        <PageTitle title={t('labels.login')} />

        <Box component="form" noValidate onSubmit={handleSubmit(handleLogin)} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                {...register('username')}
                error={errors && errors.username ? true : false}
                helperText={errors ? errors?.username?.message : null}
                fullWidth
                label={t('labels.email_address')}
                name="username"
                type="text"
              />
            </Grid>

            <Grid item xs={12}>
              <PasswordField
                {...register('password')}
                error={errors && errors.password ? true : false}
                helperText={errors ? errors?.password?.message : null}
                fullWidth
                label={t('labels.password')}
                name="password"
              />
            </Grid>

            <Grid item xs={12}>
              <Button fullWidth type="submit">
                {t('labels.login')}
              </Button>
            </Grid>

            <Grid item xs={12}>
              <Link
                component={RouterLink}
                variant="subtitle2"
                to="/forgot-password"
                sx={{
                  textAlign: 'center',
                  width: '100%',
                  display: 'block',
                  textDecoration: 'none',
                  color: theme.palette.text.secondary, // Dynamic link color
                }}
              >
                {t('labels.forgot_password')}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Card>
    </Container>
  );
}

export default Login;
