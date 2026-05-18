import { useCallback } from 'react';
import type { GroupedExifData } from '../../../hooks/useExifParser';

interface ExifPanelProps {
  data: GroupedExifData | null;
  isEmpty: boolean;
}

function formatGroupText(data: GroupedExifData): string {
  const all = [
    ...data.camera,
    ...data.exposure,
    ...data.lens,
    ...data.gps,
    ...data.time,
    ...data.other,
  ];
  return all.map((e) => `${e.label}: ${e.value}`).join('\n');
}

function ExifGroup({ title, items }: { title: string; items: { label: string; value: string }[] }) {
  if (items.length === 0) return null;
  return (
    <div style={{ marginBottom: '16px' }}>
      <h4 style={{
        margin: '0 0 8px',
        fontSize: '13px',
        fontWeight: 600,
        color: 'var(--color-accent-secondary)',
        fontFamily: "'Noto Sans SC', sans-serif",
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
      }}>
        {title}
      </h4>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'auto 1fr',
        gap: '4px 12px',
        fontSize: '13px',
      }}>
        {items.map((item) => (
          <div key={item.label} style={{ display: 'contents' }}>
            <span style={{
              color: 'var(--color-text-secondary)',
              fontFamily: "'Noto Sans SC', sans-serif",
              whiteSpace: 'nowrap',
            }}>
              {item.label}
            </span>
            <span style={{
              color: 'var(--color-text-primary)',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '12px',
              wordBreak: 'break-all',
            }}>
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ExifPanel({ data, isEmpty }: ExifPanelProps) {
  const handleCopyAll = useCallback(() => {
    if (!data) return;
    const text = formatGroupText(data);
    navigator.clipboard.writeText(text).catch(() => {});
  }, [data]);

  if (isEmpty) {
    return (
      <div style={{
        padding: '24px',
        textAlign: 'center',
        color: 'var(--color-text-secondary)',
        fontFamily: "'Noto Sans SC', sans-serif",
        fontSize: '14px',
      }}>
        该照片不含 EXIF 信息
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{
        padding: '24px',
        textAlign: 'center',
        color: 'var(--color-text-secondary)',
        fontFamily: "'Noto Sans SC', sans-serif",
        fontSize: '14px',
      }}>
        暂无 EXIF 数据
      </div>
    );
  }

  const hasData = data.camera.length > 0 || data.exposure.length > 0 ||
    data.lens.length > 0 || data.gps.length > 0 ||
    data.time.length > 0 || data.other.length > 0;

  if (!hasData) {
    return (
      <div style={{
        padding: '24px',
        textAlign: 'center',
        color: 'var(--color-text-secondary)',
        fontFamily: "'Noto Sans SC', sans-serif",
        fontSize: '14px',
      }}>
        该照片不含 EXIF 信息
      </div>
    );
  }

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={handleCopyAll}
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          padding: '4px 10px',
          background: 'var(--color-bg-elevated)',
          border: '1px solid var(--color-border)',
          borderRadius: '6px',
          color: 'var(--color-text-secondary)',
          fontSize: '12px',
          fontFamily: "'Noto Sans SC', sans-serif",
          cursor: 'pointer',
        }}
      >
        复制参数
      </button>

      <ExifGroup title="相机信息" items={data.camera} />
      <ExifGroup title="曝光参数" items={data.exposure} />
      <ExifGroup title="镜头信息" items={data.lens} />
      <ExifGroup title="GPS" items={data.gps} />
      <ExifGroup title="时间" items={data.time} />
      <ExifGroup title="其他" items={data.other} />
    </div>
  );
}
