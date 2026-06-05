import { useState, useCallback, lazy, Suspense } from 'react';
import { FrameWatermark } from '../components/cameravision/FrameWatermark/FrameWatermark';
import { TabBar } from '../components/cameravision/shared/TabBar';

const ExifAnalyzer = lazy(() =>
  import('../components/cameravision/ExifAnalyzer/ExifAnalyzer').then((m) => ({ default: m.ExifAnalyzer }))
);

const ShootingPlan = lazy(() =>
  import('../components/cameravision/ShootingPlan/ShootingPlan').then((m) => ({ default: m.ShootingPlan }))
);

const PoseReference = lazy(() =>
  import('../components/cameravision/PoseReference/PoseReference').then((m) => ({ default: m.PoseReference }))
);

const TABS = [
  { id: 'frame-watermark', label: '边框水印' },
  { id: 'exif-analyzer', label: 'EXIF 分析' },
  { id: 'shooting-plan', label: '拍摄方案' },
  { id: 'pose-reference', label: '摆姿参考' },
];

function LazyFallback() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '400px',
      color: 'var(--color-text-secondary)',
      fontFamily: "'Noto Sans SC', sans-serif",
      fontSize: '14px',
    }}>
      加载中...
    </div>
  );
}

const STORAGE_KEY = 'cameravision-active-tab';

export default function CameraVision() {
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) || 'frame-watermark';
  });
  const [selectedPoseId, setSelectedPoseId] = useState<string | null>(
    () => localStorage.getItem('cameravision-selected-pose') || null,
  );

  const handleTabChange = useCallback((id: string) => {
    setActiveTab(id);
    localStorage.setItem(STORAGE_KEY, id);
  }, []);

  const handlePoseSelect = useCallback((poseId: string) => {
    setSelectedPoseId(poseId);
    localStorage.setItem('cameravision-selected-pose', poseId);
    // 切换到摆姿参考 Tab
    setActiveTab('pose-reference');
    localStorage.setItem(STORAGE_KEY, 'pose-reference');
  }, []);

  const handleClearPoseId = useCallback(() => {
    setSelectedPoseId(null);
    localStorage.removeItem('cameravision-selected-pose');
  }, []);

  const renderTab = useCallback(() => {
    switch (activeTab) {
      case 'frame-watermark':
        return <FrameWatermark />;
      case 'exif-analyzer':
        return (
          <Suspense fallback={<LazyFallback />}>
            <ExifAnalyzer />
          </Suspense>
        );
      case 'shooting-plan':
        return (
          <Suspense fallback={<LazyFallback />}>
            <ShootingPlan onSelectPose={handlePoseSelect} />
          </Suspense>
        );
      case 'pose-reference':
        return (
          <Suspense fallback={<LazyFallback />}>
            <PoseReference
              initialPoseId={selectedPoseId}
              onClearPoseId={handleClearPoseId}
            />
          </Suspense>
        );
      default:
        return (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '400px',
            color: 'var(--color-text-secondary)',
            fontFamily: "'Noto Sans SC', sans-serif",
            fontSize: '16px',
          }}>
            即将上线
          </div>
        );
    }
  }, [activeTab, selectedPoseId, handlePoseSelect, handleClearPoseId]);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-bg)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <header style={{
        padding: '16px 24px',
        borderBottom: '1px solid var(--color-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '20px',
          fontWeight: 600,
          color: 'var(--color-text-primary)',
          margin: 0,
        }}>
          Camera Vision
        </h1>
        <a
          href="/"
          style={{
            color: 'var(--color-text-secondary)',
            textDecoration: 'none',
            fontSize: '14px',
            fontFamily: "'Noto Sans SC', sans-serif",
          }}
        >
          ← Back Home
        </a>
      </header>

      <TabBar tabs={TABS} activeTab={activeTab} onTabChange={handleTabChange} />

      <main style={{ flex: 1, padding: '16px' }}>
        {renderTab()}
      </main>
    </div>
  );
}
