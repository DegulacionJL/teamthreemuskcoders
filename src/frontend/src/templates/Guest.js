import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { Box, CssBaseline } from '@mui/material';
import Navbar from 'components/organisms/User/Navbar';

export default function GuestLayout() {
  return (
    <>
      <CssBaseline />
      <Navbar />
      <Box component="main" sx={{ minHeight: '80vh' }}>
        <Outlet />
      </Box>

      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        draggable
      />
    </>
  );
}
