import admin from './admin';

const routes = [
  // Dont Remove. Handle 404 Pages
  {
    path: '*',
    component: 'pages/guest/NotFound',
    auth: false,
  },
  {
    path: '/',
    component: 'pages/guest/Landing',
    auth: false,
  },
  {
    path: '/about',
    component: 'pages/guest/About',
    auth: false,
  },
  {
    path: '/signup',
    component: 'pages/guest/Signup',
    auth: false,
  },
  {
    path: '/login',
    component: 'pages/guest/Login',
    auth: false,
  },
  {
    path: '/forgot-password',
    component: 'pages/guest/ForgotPassword',
    auth: false,
  },
  {
    path: '/password/reset',
    component: 'pages/guest/ResetPassword',
    auth: false,
  },
  {
    path: '/activate',
    component: 'pages/guest/Activate',
    auth: false,
  },
  {
    path: '/profile',
    component: 'pages/authenticated/Profile',
    auth: true,
  },
  {
    path: '/terms',
    component: 'pages/guest/Terms',
    auth: false,
  },
  {
    path: '/faq',
    component: 'pages/guest/Faq',
    auth: false,
  },
  {
    path: '/inquiry',
    component: 'pages/guest/Inquiry',
    auth: false,
  },
  {
    path: '/privacy-policy',
    component: 'pages/guest/PrivacyPolicy',
    auth: false,
  },
  {
    path: '/calculate',
    component: 'pages/guest/Calculate',
    auth: false,
  },
  ...admin,
];

// Don't include styleguide in production routes
if (process.env.ENVIRONMENT !== 'production') {
  routes.push({
    path: '/styleguide',
    component: 'pages/guest/Styleguide',
    auth: false,
  });
}

export default routes;
