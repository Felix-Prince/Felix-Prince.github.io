import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { GradientOrbs } from './components/layout/GradientOrbs';
import { Home } from './pages/Home';
import { ColorWalk } from './pages/ColorWalk';
import { PhotoGallery } from './pages/PhotoGallery';
import './styles/globals.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <>
            <GradientOrbs />
            <Home />
          </>
        } />
        <Route path="/colorwalk" element={<ColorWalk />} />
        <Route path="/photogallery" element={<PhotoGallery />} />
      </Routes>
    </Router>
  );
}

export default App;
