import { yupResolver } from '@hookform/resolvers/yup';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { searchRoles } from 'services/role.service';
import { createUser, updateUser } from 'services/user.service';
import * as yup from 'yup';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from 'components/atoms/Button';
import Select from 'components/atoms/Form/Select';
import TextField from 'components/atoms/Form/TextField';
import Modal from 'components/organisms/Modal';
import errorHandler from 'utils/errorHandler';

AddEditModal.propTypes = {
  open: PropTypes.bool,
  user: PropTypes.object,
  handleSaveEvent: PropTypes.func,
  handleClose: PropTypes.func,
};

export default function AddEditModal(props) {
  const { user, open, handleClose, handleSaveEvent } = props;

  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(null);
  const [roles, setRoles] = useState([]);

  // form validation
  const schema = yup.object({
    first_name: yup.string().required(t('form.required')),
    last_name: yup.string().required(t('form.required')),
    email: yup.string().required(t('form.required')).email(t('form.email')),
    role: yup.string().required(t('form.required')),
  });

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    setLoading(false);

    setTitle(t('pages.users.add_user'));
    setValue('first_name', '');
    setValue('last_name', '');
    setValue('email', '');
    setValue('role', '');

    if (user) {
      // pre-fill the form
      setTitle(t('pages.users.edit_user'));
      setValue('first_name', user.first_name);
      setValue('last_name', user.last_name);
      setValue('email', user.email);
      setValue('role', user.role);
    }
  }, [user]);

  useEffect(() => {
    if (!open) clearErrors();
    else fetchRoles();
  }, [open]);

  const handleFormSubmit = async (data) => {
    setLoading(true);

    console.log(data);

    try {
      const response = user ? await updateUser(user.id, data) : await createUser(data);
      reset();
      setLoading(false);
      handleSaveEvent(response);
    } catch (err) {
      errorHandler(err, setError, toast);
    }
  };

  const fetchRoles = async () => {
    const { data } = await searchRoles();
    setRoles(() =>
      data.map((role) => ({
        label: role.name,
        value: role.name,
      }))
    );
  };

  return (
    <Modal open={open} handleClose={handleClose} title={title}>
      <Box sx={{ pt: 2 }}>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid item md={6}>
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
            <Grid item md={6}>
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
            <Grid item md={12}>
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
            <Grid item md={12}>
              <Controller
                {...register('role')}
                name="role"
                control={control}
                render={({ field }) => (
                  <Select {...field} label={t('labels.role')} options={roles} />
                )}
              />
            </Grid>
          </Grid>

          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'end', px: 2, pb: 2, gap: 1 }}>
            <Button onClick={handleClose} variant="outlined" disabled={loading}>
              {t('labels.cancel')}
            </Button>

            <Button disabled={loading} type="submit">
              {user ? t('labels.update') : t('labels.save')}
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
}
