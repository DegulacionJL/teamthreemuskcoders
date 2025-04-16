const user = [
  // Don't Remove. Handle 404 Pages
  {
    path: '/userlist',
    component: 'pages/guest/UserList',
    auth: true,
  },
  {
    path: '/memefeed',
    component: 'components/organisms/User/MemeFeed',
    auth: true,
  },
];

// Ensure the environment variable is correctly checked
if (process.env.ENVIRONMENT !== 'production') {
  user.push({
    path: '/styleguide',
    component: 'pages/guest/Styleguide',
    auth: false,
  });
}

export default user;
