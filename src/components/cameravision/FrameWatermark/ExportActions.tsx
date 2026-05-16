import { useState, useCallback } from 'react';
import type { ImageTier, RenderConfig } from '../../../utils/frame-renderer/types';

interface ExportActionsProps {
  imageTier: ImageTier | null;
  config: RenderConfig;
}

export function ExportActions({ imageTier, config: _config }: ExportActionsProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = useCallback(async () => {
    if (!imageTier) return;
    setIsExporting(true);

    try {
      // In a full implementation, this would render at full resolution
      // For now, trigger a download of the original image as placeholder
      const link = document.createElement('a');
      link.download = `cameravision-export-${Date.now()}.jpg`;
      link.href = imageTier.original;
      link.click();
    } finally {
      setIsExporting(false);
    }
  }, [imageTier]);

  if (!imageTier) {
    return (
      <button
        disabled
        style={{
          width: '100%',
          padding: '10px',
          border: 'none',
          borderRadius: '8px',
          background: 'var(--color-border)',
          color: 'rgba(255,255,255,0.3)',
          cursor: 'not-allowed',
          fontSize: '14px',
          fontFamily: "'Noto Sans SC', sans-serif",
        }}
      >
        导出当前
      </button>
    );
  }

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      style={{
        width: '100%',
        padding: '10px',
        border: 'none',
        borderRadius: '8px',
        background: isExporting ? 'var(--color-border)' : 'var(--color-accent)',
        color: '#fff',
        cursor: isExporting ? 'not-allowed' : 'pointer',
        fontSize: '14px',
        fontFamily: "'Noto Sans SC', sans-serif",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
      }}
    >
      {isExporting ? '导出中...' : '导出当前'}
    </button>
  );
}
