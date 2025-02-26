import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import {
  calculateAddition,
  calculateDivision,
  calculateMultiplication,
  calculateSubtraction,
} from 'services/calculate.services';
import * as yup from 'yup';
import { Box, Card, Container, Grid } from '@mui/material';
import Button from 'components/atoms/Button';
import TextField from 'components/atoms/Form/TextField';
import PageTitle from 'components/atoms/PageTitle';
import errorHandler from 'utils/errorHandler';

function Calculate() {
  const { t } = useTranslation();

  // form validation
  const schema = yup.object({
    num1: yup.number(),
    num2: yup.number(),
  });

  const {
    register,
    setError,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      num1: '',
      num2: '',
      result: '',
    },
  });

  const handleAddition = async (data) => {
    try {
      const result = await calculateAddition(data);
      toast(`${t('Result')}: ${result.data.result}`, { type: 'success' });
      setValue('result', result.data.result);
    } catch (error) {
      errorHandler(error, setError, toast);
    }
  };

  const handleSubtraction = async (data) => {
    try {
      const result = await calculateSubtraction(data);
      toast(`${t('Result')}: ${result.data.result}`, { type: 'success' });
      setValue('result', result.data.result);
    } catch (error) {
      errorHandler(error, setError, toast);
    }
  };

  const handleMultiplication = async (data) => {
    try {
      const result = await calculateMultiplication(data);
      toast(`${t('Result')}: ${result.data.result}`, { type: 'success' });
      setValue('result', result.data.result);
    } catch (error) {
      errorHandler(error, setError, toast);
    }
  };

  const handleDivision = async (data) => {
    try {
      const result = await calculateDivision(data);
      toast(`${t('Result')}: ${result.data.result}`, { type: 'success' });
      setValue('result', result.data.result);
    } catch (error) {
      errorHandler(error, setError, toast);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ pt: 8, marginLeft: 16 }}>
      <Card
        sx={{
          p: 4,
          boxShadow: '0px 15px 20px rgba(0, 0, 0, 0.2)',
          borderRadius: 2,
          '&:hover': {
            boxShadow: '0px 15px 20px rgba(0, 0, 0, 0.4)',
          },
        }}
      >
        <PageTitle title={t('Calculator')} />

        <Box component="form" noValidate sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                {...register('num1')}
                error={errors && errors.num1 ? true : false}
                helperText={errors ? errors?.num1?.message : null}
                name="num1"
                fullWidth
                id="num1"
                label={t('Num1')}
                type="number"
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                {...register('num2')}
                error={errors && errors.num2 ? true : false}
                helperText={errors ? errors?.num2?.message : null}
                fullWidth
                id="num2"
                label={t('Num2')}
                name="num2"
                type="number"
                size="small"
              />
            </Grid>
            <Grid item xs={3}>
              <Button
                fullWidth
                type="button"
                onClick={handleSubmit(handleAddition)}
                sx={{
                  fontSize: '30px',
                  padding: '0px',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#189ab4',
                  '&:hover': {
                    backgroundColor: '#75e6da',
                  },
                }}
              >
                {t('+')}
              </Button>
            </Grid>

            <Grid item xs={3}>
              <Button
                fullWidth
                type="button"
                onClick={handleSubmit(handleSubtraction)}
                sx={{
                  fontSize: '30px',
                  padding: '0px',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#189ab4',
                  '&:hover': {
                    backgroundColor: '#75e6da',
                  },
                }}
              >
                {t('-')}
              </Button>
            </Grid>

            <Grid item xs={3}>
              <Button
                fullWidth
                type="button"
                onClick={handleSubmit(handleDivision)}
                sx={{
                  fontSize: '30px',
                  padding: '0px',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#189ab4',
                  '&:hover': {
                    backgroundColor: '#75e6da',
                  },
                }}
              >
                {t('÷')}
              </Button>
            </Grid>

            <Grid item xs={3}>
              <Button
                fullWidth
                type="button"
                onClick={handleSubmit(handleMultiplication)}
                sx={{
                  fontSize: '20px',
                  padding: '0px',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#189ab4',
                  '&:hover': {
                    backgroundColor: '#75e6da',
                  },
                }}
              >
                {t('x')}
              </Button>
            </Grid>

            <Grid item xs={12}>
              <TextField
                {...register('result')}
                fullWidth
                label={t('Answer')}
                name="result"
                type="text"
                size="small"
                inputProps={{ readOnly: true }}
              />
            </Grid>
          </Grid>
        </Box>
      </Card>
    </Container>
  );
}

export default Calculate;
