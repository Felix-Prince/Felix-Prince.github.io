import { useState, useCallback } from 'react';
import { FrameWatermark } from '../components/cameravision/FrameWatermark/FrameWatermark';
import { TabBar } from '../components/cameravision/shared/TabBar';

const TABS = [
  { id: 'frame-watermark', label: '边框水印' },
  { id: 'exif-analyzer', label: 'EXIF 分析' },
  { id: 'crop-preview', label: '裁切预览' },
  { id: 'photo-calculator', label: '拍摄计算器' },
];

export default function CameraVision() {
  const [activeTab, setActiveTab] = useState('frame-watermark');

  const renderTab = useCallback(() => {
    switch (activeTab) {
      case 'frame-watermark':
        return <FrameWatermark />;
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
  }, [activeTab]);

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

      <TabBar tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />

      <main style={{ flex: 1, padding: '16px' }}>
        {renderTab()}
      </main>
    </div>
  );
}
