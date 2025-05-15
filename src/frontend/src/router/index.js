import { useAuth } from 'hooks/useAuth';
import { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import Loader from 'components/atoms/Loader';
import routes from './routes';

const AdminLayout = lazy(() => import('templates/Authenticated'));
const UserLayout = lazy(() => import('templates/User'));
const GuestLayout = lazy(() => import('templates/Guest'));
const Logout = lazy(() => import('pages/guest/Logout'));

function Router() {
  const { user } = useAuth({ middleware: 'auth ' });

  if (!user) console.log();

  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {routes.map((route, i) => {
          const Page = lazy(() => import(`../${route.component}`));

          let Layout;
          if (route.auth) {
            if (route.layout === 'Admin') {
              Layout = AdminLayout;
            } else if (route.layout === 'User') {
              Layout = UserLayout;
            } else {
              Layout = AdminLayout; // default to admin if not specified
            }
          } else {
            Layout = GuestLayout;
          }

          return (
            <Route key={i} element={<Layout />}>
              <Route path={route.path} element={<Page />} />
            </Route>
          );
        })}

        <Route exact path="/logout" element={<Logout />} />
      </Routes>
    </Suspense>
  );
}

export default Router;
