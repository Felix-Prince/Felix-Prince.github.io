import React, { useEffect, lazy } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ChipBackground } from './components/layout/ChipBackground';
// import SplineBackground from './components/layout/SplineBackground';
import { Home } from './pages/Home';
import { ColorWalk } from './pages/ColorWalk';
import { PhotoGallery } from './pages/PhotoGallery';
import { RoadmapHub } from './pages/RoadmapHub';
import './styles/globals.css';

const CameraVision = lazy(() => import('./pages/CameraVision'));

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <Router>
      <ScrollToTop />
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
        <Route path="/roadmaps" element={<RoadmapHub />} />
        <Route path="/cameravision" element={
          <React.Suspense fallback={
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100vh',
              background: 'var(--color-bg)',
              color: 'var(--color-text-secondary)',
              fontFamily: "'Noto Sans SC', sans-serif",
            }}>
              加载中...
            </div>
          }>
            <CameraVision />
          </React.Suspense>
        } />
      </Routes>
    </Router>
  );
}

export default App;
