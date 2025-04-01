// Only showing the relevant part that needs to be changed
// ...existing imports...
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

function Navbar(props) {
  const { t } = useTranslation();
  const [anchorMobileNav, setAnchorMobileNav] = useState(null);
  const navigate = useNavigate();

  // ...existing code...

  // Change this to use admin-prefixed routes
  const menus = [{ label: t('menu.about'), url: '/admin/about' }];

  // ...existing code...

  const handleCloseNavMenu = (url) => {
    setAnchorMobileNav(null);
    // Make sure we're navigating within the admin context
    if (url && !url.startsWith('/admin')) {
      url = `/admin${url}`;
    }
    navigate(url, { replace: true });
  };

  const links = [
    { label: t('menu.profile'), url: '/admin/profile' }, // Changed to admin/profile
    { label: t('menu.logout'), url: '/logout' },
  ];

  // ...rest of the component...
}

export default Navbar;
