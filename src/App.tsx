import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { ChipBackground } from './components/layout/ChipBackground';
// import SplineBackground from './components/layout/SplineBackground';
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
            <ChipBackground />
            {/* <SplineBackground /> */}
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
