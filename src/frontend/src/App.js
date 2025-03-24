import { Route, Routes } from 'react-router-dom';
import { Box } from '@mui/material';
import Navbar from './components/organisms/User/Navbar';
import About from './pages/guest/About';
import FAQ from './pages/guest/About';
import Inquiry from './pages/guest/About';
import StyleGuide from './pages/guest/About';
import MemeFeed from './pages/guest/MemeFeed';

function App() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Routes>
          <Route path="/" element={<MemeFeed />} />
          <Route path="/meme-feed" element={<MemeFeed />} />
          <Route path="/about" element={<About />} />
          <Route path="/inquiry" element={<Inquiry />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/styleguide" element={<StyleGuide />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default App;
