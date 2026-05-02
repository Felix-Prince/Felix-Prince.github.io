import Spline from '@splinetool/react-spline';

export default function SplineBackground() {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 0,
      pointerEvents: 'auto',
      overflow: 'hidden'
    }}>
      <Spline
        scene="https://prod.spline.design/0M89bnzEq2tvqV1j/scene.splinecode"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}
