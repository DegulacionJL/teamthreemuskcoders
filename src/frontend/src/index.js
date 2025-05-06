import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import './i18n';
import store from './store';
import { ThemeProvider } from './theme/ThemeContext';

// handle windows display scaling
const scale = +1 / window.devicePixelRatio > 1 ? +1 / window.devicePixelRatio : 1;
document
  .querySelector('meta[name=viewport]')
  .setAttribute('content', `width=device-width, initial-scale=${scale}`);

const rootElement = document.getElementById('root');

const token = localStorage.getItem('access_token');
const { REACT_APP_WEBSOCKET_KEY, REACT_APP_WEBSOCKET_HOST, REACT_APP_WEBSOCKET_CLUSTER } =
  process.env;

if (token) {
  window.Pusher = Pusher;
  window.Echo = new Echo({
    broadcaster: 'pusher',
    key: REACT_APP_WEBSOCKET_KEY,
    wsHost: REACT_APP_WEBSOCKET_HOST,
    cluster: REACT_APP_WEBSOCKET_CLUSTER,
    authEndpoint: '/api/v1/broadcasting/auth',
    auth: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    forceTLS: false,
    encrypted: true,
    enableLogging: true,
    disableStats: true,
    enabledTransports: ['ws', 'wss'],
  });
}

// Get the root element
const container = document.getElementById('root');

// Create a root
const root = createRoot(container);

// Render the app
root.render(
  <AuthProvider>
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  </AuthProvider>
);
