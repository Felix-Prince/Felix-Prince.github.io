import { useCallback, useRef, useState } from 'react';
import type { RenderConfig, ImageTier } from '../../../utils/frame-renderer/types';
import { LogoSelector } from './LogoSelector';

interface PhotoEntry {
  id: string;
  tier: ImageTier;
  file: File;
  exif?: Record<string, unknown>;
}

interface SettingPanelProps {
  config: RenderConfig;
  photos: PhotoEntry[];
  activeIndex: number;
  exifText: string;
  onFiles: (files: FileList) => void;
  onSelectPhoto: (index: number) => void;
  onUpdateConfig: (partial: Partial<RenderConfig>) => void;
  onExifTextChange: (text: string) => void;
}

export function SettingPanel({
  config,
  photos,
  activeIndex,
  exifText,
  onFiles,
  onSelectPhoto,
  onUpdateConfig,
  onExifTextChange,
}: SettingPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [logoPickerOpen, setLogoPickerOpen] = useState(false);

  const handleImportClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        onFiles(e.target.files);
      }
    },
    [onFiles],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer.files.length > 0) {
        onFiles(e.dataTransfer.files);
      }
    },
    [onFiles],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleSlider = useCallback(
    (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = Number(e.target.value);
      onUpdateConfig({
        frame: { ...config.frame, [key]: value },
      });
    },
    [config.frame, onUpdateConfig],
  );

  const setWatermark = useCallback(
    (partial: Partial<typeof config.frame.watermark>) => {
      onUpdateConfig({
        frame: {
          ...config.frame,
          watermark: { ...config.frame.watermark, ...partial },
        },
      });
    },
    [config.frame, onUpdateConfig],
  );

  const { watermark } = config.frame;

  return (
    <div
      style={{
        width: '280px',
        minWidth: '280px',
        maxWidth: '280px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        overflowY: 'auto',
        fontFamily: "'Noto Sans SC', sans-serif",
      }}
    >
      {/* Import area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        style={{
          padding: '16px',
          border: '1px dashed var(--color-border)',
          borderRadius: '8px',
          textAlign: 'center',
          cursor: 'pointer',
          background: 'var(--color-bg-elevated, rgba(36,116,166,0.08))',
        }}
        onClick={handleImportClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <button
          style={{
            padding: '8px 16px',
            background: 'var(--color-accent)',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontFamily: "'Noto Sans SC', sans-serif",
          }}
        >
          导入照片
        </button>
        <p style={{
          margin: '8px 0 0',
          fontSize: '12px',
          color: 'var(--color-text-secondary)',
        }}>
          或拖拽照片到此处
        </p>
      </div>

      {/* Thumbnail strip */}
      {photos.length > 0 && (
        <div style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          padding: '8px 0',
        }}>
          {photos.map((photo, idx) => (
            <img
              key={photo.id}
              src={photo.tier.thumbnail}
              alt=""
              onClick={() => onSelectPhoto(idx)}
              style={{
                width: '56px',
                height: '56px',
                objectFit: 'cover',
                borderRadius: '4px',
                cursor: 'pointer',
                border: idx === activeIndex ? '2px solid var(--color-accent-secondary)' : '2px solid transparent',
                opacity: idx === activeIndex ? 1 : 0.6,
                transition: 'opacity 0.2s, border-color 0.2s',
              }}
            />
          ))}
        </div>
      )}

      {/* Frame settings */}
      <PanelSection title="相框设置">
        <SliderControl
          label="虚化程度"
          value={config.frame.blurRadius}
          min={0}
          max={200}
          onChange={handleSlider('blurRadius')}
        />
        <SliderControl
          label="圆角半径"
          value={config.frame.cornerRadius}
          min={0}
          max={500}
          onChange={handleSlider('cornerRadius')}
        />
        <SliderControl
          label="阴影偏移"
          value={config.frame.shadowOffset}
          min={0}
          max={500}
          onChange={handleSlider('shadowOffset')}
        />
      </PanelSection>

      {/* Watermark settings */}
      <PanelSection title="水印设置">
        <div style={{ marginBottom: '8px' }}>
          <label style={labelStyle}>相机 LOGO</label>
          <button
            onClick={() => setLogoPickerOpen(true)}
            style={{
              display: 'block',
              marginTop: '4px',
              padding: '6px 12px',
              background: 'var(--color-bg-elevated, rgba(36,116,166,0.08))',
              border: '1px solid var(--color-border)',
              borderRadius: '6px',
              color: watermark.logo ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
              cursor: 'pointer',
              fontSize: '13px',
              fontFamily: "'Noto Sans SC', sans-serif",
            }}
          >
            {watermark.logo || '选择品牌 LOGO'}
          </button>
        </div>

        <div style={{ marginBottom: '8px' }}>
          <label style={labelStyle}>型号</label>
          <input
            value={watermark.model}
            onChange={(e) => setWatermark({ model: e.target.value })}
            placeholder="如 Z30、A7M4"
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: '8px' }}>
          <label style={labelStyle}>EXIF 参数</label>
          <input
            value={exifText}
            onChange={(e) => onExifTextChange(e.target.value)}
            placeholder="35mm f/1.8 1/500 ISO200"
            style={inputStyle}
          />
        </div>

        <SliderControl
          label={`字号 (${watermark.fontSize}px)`}
          value={watermark.fontSize}
          min={0}
          max={500}
          onChange={(e) => setWatermark({ fontSize: Number(e.target.value) })}
        />

        <div style={{ marginBottom: '8px' }}>
          <label style={labelStyle}>字体</label>
          <select
            value={watermark.fontFamily}
            onChange={(e) => setWatermark({ fontFamily: e.target.value })}
            style={selectStyle}
          >
            <option value="Arial">Arial</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Georgia">Georgia</option>
            <option value="Courier New">Courier New</option>
          </select>
        </div>

        <div style={{ marginBottom: '8px' }}>
          <label style={labelStyle}>字体颜色</label>
          <input
            type="color"
            value={watermark.fontColor}
            onChange={(e) => setWatermark({ fontColor: e.target.value })}
            style={{ display: 'block', marginTop: '4px', height: '32px', width: '64px' }}
          />
        </div>
      </PanelSection>

      {/* Export */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          disabled={!photos[activeIndex]}
          style={{
            flex: 1,
            padding: '10px',
            border: 'none',
            borderRadius: '8px',
            background: photos[activeIndex]
              ? 'var(--color-accent)'
              : 'var(--color-border)',
            color: '#fff',
            cursor: photos[activeIndex] ? 'pointer' : 'not-allowed',
            fontSize: '14px',
            fontFamily: "'Noto Sans SC', sans-serif",
          }}
        >
          导出当前
        </button>
      </div>

      {/* Logo selector overlay */}
      <LogoSelector
        isOpen={logoPickerOpen}
        selectedLogo={watermark.logo}
        onSelect={(logo) => setWatermark({ logo })}
        onClose={() => setLogoPickerOpen(false)}
      />
    </div>
  );
}

// Sub-components

function PanelSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{
      padding: '12px',
      background: 'var(--color-bg-elevated, rgba(36,116,166,0.08))',
      borderRadius: '8px',
      border: '1px solid var(--color-border)',
    }}>
      <h3 style={{
        margin: '0 0 10px',
        fontSize: '13px',
        fontWeight: 600,
        color: 'var(--color-text-secondary)',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
      }}>
        {title}
      </h3>
      {children}
    </div>
  );
}

interface SliderControlProps {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function SliderControl({ label, value, min, max, onChange }: SliderControlProps) {
  return (
    <div style={{ marginBottom: '8px' }}>
      <label style={labelStyle}>{label}</label>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={onChange}
        style={{ width: '100%', marginTop: '4px' }}
      />
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '12px',
  color: 'var(--color-text-secondary)',
  marginBottom: '4px',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '6px 8px',
  background: 'transparent',
  border: 'none',
  borderBottom: '1px solid var(--color-border)',
  color: 'var(--color-text-primary)',
  fontSize: '13px',
  outline: 'none',
  fontFamily: "'Noto Sans SC', sans-serif",
  boxSizing: 'border-box',
};

const selectStyle: React.CSSProperties = {
  width: '100%',
  padding: '6px 8px',
  background: 'transparent',
  border: '1px solid var(--color-border)',
  borderRadius: '4px',
  color: 'var(--color-text-primary)',
  fontSize: '13px',
  outline: 'none',
  fontFamily: "'Noto Sans SC', sans-serif",
};
