import { useRef, useCallback } from 'react';

interface ImageImporterProps {
  onFiles: (files: FileList) => void;
}

export function ImageImporter({ onFiles }: ImageImporterProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleChange = useCallback(
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

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      style={{
        padding: '24px 16px',
        border: '1px dashed var(--color-border)',
        borderRadius: '8px',
        textAlign: 'center',
        cursor: 'pointer',
        background: 'var(--color-bg-elevated, rgba(36,116,166,0.08))',
      }}
      onClick={handleClick}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        style={{ display: 'none' }}
        onChange={handleChange}
      />
      <button
        style={{
          padding: '8px 20px',
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
  );
}
