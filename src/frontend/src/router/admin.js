const admin = [
  {
    path: '/admin',
    component: 'pages/authenticated/admin/Dashboard',
    auth: true,
    layout: 'admin', // Add this layout property
  },
  {
    path: '/admin/users',
    component: 'pages/authenticated/admin/Users',
    auth: true,
    layout: 'admin',
  },
  {
    path: '/admin/roles',
    component: 'pages/authenticated/admin/Roles',
    auth: true,
    layout: 'admin',
  },
  {
    path: '/admin/integrations',
    component: 'pages/authenticated/admin/Integrations',
    auth: true,
    layout: 'admin',
  },
  // DEMO PURPOSES ONLY. REMOVE ON ACTUAL PROJECT
  {
    path: '/admin/broadcast',
    component: 'pages/authenticated/admin/Broadcast',
    auth: true,
    layout: 'admin',
  },
  // Add the admin about route
  {
    path: '/admin/about',
    component: 'pages/authenticated/admin/About',
    auth: true,
    layout: 'admin',
  },
  // Add the admin profile route if needed
  {
    path: '/admin/profile',
    component: 'pages/authenticated/admin/Profile',
    auth: true,
    layout: 'admin',
  },
];

export default admin;
