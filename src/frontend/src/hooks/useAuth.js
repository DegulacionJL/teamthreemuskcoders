import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useSWR from 'swr';
import api from 'utils/api';

export const useAuth = ({ middleware, location, redirectIfAuthenticated } = {}) => {
  const navigate = useNavigate();

  const {
    data: user,
    error,
    mutate,
  } = useSWR(
    '/profile',
    () =>
      api
        .get('/profile')
        .then((res) => res.data.data)
        .catch(() => {
          if (error.response.status != 409) throw error;
          navigate('/verify-email');
        }),
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const login = async ({ ...props }) => {
    return await api
      .post('/oauth/token', {
        grant_type: 'password',
        client_id: process.env.REACT_APP_CLIENT_ID,
        client_secret: process.env.REACT_APP_CLIENT_SECRET,
        ...props,
      })
      .then(({ data }) => {
        const { access_token, refresh_token } = data;
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', refresh_token);
        return data;
      });
  };

  const logout = async () => {
    if (!error) {
      return await api.delete('/oauth/token').then(() => {
        localStorage.clear();
        window.location = '/login?ref=logout';
      });
    }

    // if not authenticated, set redirect url to the url accessed by user
    window.location = `/login?redirect_to=${location.pathname}`;
  };

  useEffect(() => {
    if (middleware == 'guest' && redirectIfAuthenticated && user) navigate(redirectIfAuthenticated);
    if (middleware == 'auth' && error) logout();
  }, [user, error]);

  return {
    user,
    login,
    logout,
    mutate,
  };
};
