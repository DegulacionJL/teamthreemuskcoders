import { yupResolver } from '@hookform/resolvers/yup';
import { useAuth } from 'hooks/useAuth';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { updateProfile } from 'services/profile.service';
import { setProfile } from 'store/slices/profileSlice';
import * as yup from 'yup';
import { Box, Card, Container, Grid, Typography } from '@mui/material';
import AvatarField from 'components/atoms/AvatarField';
import Button from 'components/atoms/Button';
import TextField from 'components/atoms/Form/TextField';
import errorHandler from 'utils/errorHandler';

function Profile() {
  const { t } = useTranslation();
  // const user = useSelector((state) => state.profile.user);
  const { user } = useAuth({ middleware: 'auth' });
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  // form validation
  const schema = yup.object({
    first_name: yup.string().required(t('form.required')),
    last_name: yup.string().required(t('form.required')),
    email: yup.string().required(t('form.required')).email(t('form.email')),
  });

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleUpdate = async (data) => {
    setLoading(true);

    try {
      const updatedUser = await updateProfile(data);
      setLoading(false);
      await dispatch(setProfile(updatedUser));
      toast(t('pages.profile.success_message'), { type: 'success' });
    } catch (err) {
      setLoading(false);
      errorHandler(err, setError, toast);
    }
  };

  useEffect(() => {
    if (user) {
      setValue('first_name', user.first_name);
      setValue('last_name', user.last_name);
      setValue('email', user.email);
    }
  }, [user]);

  return (
    <Container maxWidth="xs" sx={{ pt: 6 }}>
      <Typography variant="h4" component="h4" sx={{ fontWeight: 'bold', mb: 2 }} align="center">
        {t('pages.profile.heading')}
      </Typography>

      <Typography align="center" color="text.secondary" component="p" sx={{ mb: 4 }}>
        {t('pages.profile.sub_heading')}
      </Typography>

      {user && (
        <Card sx={{ p: 3 }}>
          <form onSubmit={handleSubmit(handleUpdate)}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <AvatarField
                  width={140}
                  label={user.full_name}
                  url={user.avatar}
                  onFileSelect={(url) => setValue('avatar', url)}
                  editable={true}
                  name="avatar"
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  {...register('first_name')}
                  error={errors && errors.first_name ? true : false}
                  helperText={errors ? errors?.first_name?.message : null}
                  fullWidth
                  label={t('labels.first_name')}
                  name="first_name"
                  type="text"
                  size="small"
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  {...register('last_name')}
                  error={errors && errors.last_name ? true : false}
                  helperText={errors ? errors?.last_name?.message : null}
                  fullWidth
                  label={t('labels.last_name')}
                  name="last_name"
                  type="text"
                  size="small"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  {...register('email')}
                  error={errors && errors.email ? true : false}
                  helperText={errors ? errors?.email?.message : null}
                  fullWidth
                  label={t('labels.email_address')}
                  name="email"
                  type="text"
                  size="small"
                />
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'end' }}>
                  <Button color="primary" disabled={loading} type="submit">
                    {t('labels.update')}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Card>
      )}
    </Container>
  );
}

export default Profile;
